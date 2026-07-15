using Canaboom.Buildings;
using Canaboom.Core;
using Canaboom.Resources;
using UnityEngine;

namespace Canaboom.Grid
{
    /// <summary>
    /// Touch- und Maus-Steuerung zum Platzieren von Gebäuden auf dem Insel-Raster.
    ///
    /// Ablauf für Anfänger:
    /// 1. Wähle im Inspector ein Gebäude-Prefab (z. B. HQ).
    /// 2. Tippe auf die Insel (Handy) oder klicke + ziehe (Editor).
    /// 3. Ein Geister-Gebäude folgt dem Finger und snappt auf Rasterzellen.
    /// 4. Grün = Platzierung möglich | Rot = belegt oder außerhalb.
    /// 5. Beim Loslassen wird das echte Gebäude platziert (wenn gültig).
    ///
    /// Koordinatensystem: XZ-Ebene (Y = Höhe). Die Insel braucht einen Collider
    /// (z. B. Plane mit BoxCollider/MeshCollider, Tag „Island“ optional).
    /// </summary>
    public class BuildingPlacementController : MonoBehaviour
    {
        [Header("Referenzen / References")]
        [SerializeField] private GridSystem gridSystem;
        [SerializeField] private ResourceController resourceController;
        [SerializeField] private GameManager gameManager;
        [SerializeField] private Camera placementCamera;

        [Header("Gebäude-Auswahl / Building selection")]
        [Tooltip("Prefab das platziert werden soll (HQ, Goldmine, Turm …)")]
        [SerializeField] private GameObject selectedBuildingPrefab;

        [Tooltip("Beim Start automatisch Platzierungsmodus für selectedBuildingPrefab")]
        [SerializeField] private bool startInPlacementMode;

        [Header("Raycast / Insel")]
        [Tooltip("Nur Collider auf diesen Layers werden getroffen (z. B. Island-Layer)")]
        [SerializeField] private LayerMask islandLayerMask = ~0;

        [SerializeField] private float raycastMaxDistance = 250f;

        [Header("Ghost-Vorschau / Ghost preview")]
        [SerializeField] private float ghostHeightOffset = 0.05f;
        [SerializeField] private bool disableGhostColliders = true;

        // Interner Zustand
        private GameObject _ghostInstance;
        private Building _ghostBuilding;
        private PlacementGhostView _ghostView;
        private Vector2Int _currentGridOrigin;
        private bool _isDragging;
        private bool _placementModeActive;

        public bool IsPlacementModeActive => _placementModeActive;
        public GameObject SelectedBuildingPrefab => selectedBuildingPrefab;

        private void Awake()
        {
            if (gridSystem == null)
                gridSystem = FindFirstObjectByType<GridSystem>();
            if (resourceController == null)
                resourceController = FindFirstObjectByType<ResourceController>();
            if (gameManager == null)
                gameManager = FindFirstObjectByType<GameManager>();
            if (placementCamera == null)
                placementCamera = Camera.main;
        }

        private void Start()
        {
            if (startInPlacementMode && selectedBuildingPrefab != null)
                BeginPlacement(selectedBuildingPrefab);
        }

        private void Update()
        {
            if (!_placementModeActive || selectedBuildingPrefab == null)
                return;

            if (TryGetPointerDown(out Vector2 screenPos))
            {
                _isDragging = true;
                UpdateGhostAtScreenPosition(screenPos);
            }

            if (_isDragging && TryGetPointerHeld(out Vector2 heldPos))
                UpdateGhostAtScreenPosition(heldPos);

            if (_isDragging && TryGetPointerUp(out Vector2 releasePos))
            {
                UpdateGhostAtScreenPosition(releasePos);
                TryConfirmPlacement();
                _isDragging = false;
            }
        }

        /// <summary>
        /// Startet den Platzierungsmodus mit einem bestimmten Prefab.
        /// Wird z. B. von einem UI-Button „HQ bauen“ aufgerufen.
        /// </summary>
        public void BeginPlacement(GameObject buildingPrefab)
        {
            selectedBuildingPrefab = buildingPrefab;
            _placementModeActive = true;
            DestroyGhost();
        }

        /// <summary>
        /// Beendet den Platzierungsmodus und entfernt den Ghost.
        /// </summary>
        public void CancelPlacement()
        {
            _placementModeActive = false;
            _isDragging = false;
            DestroyGhost();
        }

        /// <summary>
        /// Wechselt das ausgewählte Gebäude ohne Modus zu verlassen.
        /// </summary>
        public void SelectBuilding(GameObject buildingPrefab)
        {
            selectedBuildingPrefab = buildingPrefab;
            DestroyGhost();
        }

        /// <summary>
        /// Aktualisiert Ghost-Position und Validitätsfarbe anhand der Bildschirmposition.
        /// </summary>
        private void UpdateGhostAtScreenPosition(Vector2 screenPosition)
        {
            if (!TryRaycastIsland(screenPosition, out Vector3 worldHit))
                return;

            Vector2Int gridOrigin = gridSystem.WorldToGrid(worldHit);
            _currentGridOrigin = gridOrigin;

            EnsureGhostExists();
            PositionGhost(gridOrigin);
            UpdateGhostValidity(gridOrigin);
        }

        /// <summary>
        /// Bestätigt die Platzierung beim Loslassen des Fingers / der Maus.
        /// </summary>
        private void TryConfirmPlacement()
        {
            if (_ghostBuilding == null)
                return;

            bool canPlace = gridSystem.CanPlace(_currentGridOrigin, _ghostBuilding.Size);
            bool canAfford = _ghostBuilding.CanAfford(resourceController);

            if (!canPlace || !canAfford)
            {
                Debug.Log("[Placement] Ungültige Position oder zu wenig Ressourcen.");
                return;
            }

            bool placed = gameManager != null
                ? gameManager.TryPlaceBuilding(selectedBuildingPrefab, _currentGridOrigin)
                : PlaceBuildingDirect(selectedBuildingPrefab, _currentGridOrigin);

            if (placed)
            {
                Debug.Log($"[Placement] {_ghostBuilding.BuildingId} platziert bei {_currentGridOrigin}.");
                CancelPlacement();
            }
        }

        /// <summary>
        /// Fallback ohne GameManager: direkt instanziieren und ins Raster eintragen.
        /// </summary>
        private bool PlaceBuildingDirect(GameObject prefab, Vector2Int gridOrigin)
        {
            if (prefab == null)
                return false;

            var prefabBuilding = prefab.GetComponent<Building>();
            if (prefabBuilding == null || !prefabBuilding.CanAfford(resourceController))
                return false;

            GameObject instance = Instantiate(prefab);
            var building = instance.GetComponent<Building>();

            if (!building.TryPurchase(resourceController))
            {
                Destroy(instance);
                return false;
            }

            if (!gridSystem.PlaceBuilding(building, gridOrigin))
            {
                resourceController.Refund(building.GoldCost, building.WoodCost, building.StoneCost);
                Destroy(instance);
                return false;
            }

            return true;
        }

        private void EnsureGhostExists()
        {
            if (_ghostInstance != null)
                return;

            _ghostInstance = Instantiate(selectedBuildingPrefab);
            _ghostInstance.name = $"GHOST_{selectedBuildingPrefab.name}";
            _ghostBuilding = _ghostInstance.GetComponent<Building>();

            if (_ghostBuilding == null)
            {
                Debug.LogError("[Placement] Prefab braucht eine Building-Component.");
                DestroyGhost();
                return;
            }

            _ghostView = _ghostInstance.GetComponent<PlacementGhostView>();
            if (_ghostView == null)
                _ghostView = _ghostInstance.AddComponent<PlacementGhostView>();

            if (disableGhostColliders)
            {
                foreach (var col in _ghostInstance.GetComponentsInChildren<Collider>())
                    col.enabled = false;
            }
        }

        private void PositionGhost(Vector2Int gridOrigin)
        {
            Vector3 center = gridSystem.GetBuildingWorldCenter(gridOrigin, _ghostBuilding.Size);
            _ghostInstance.transform.position = center + Vector3.up * ghostHeightOffset;
        }

        private void UpdateGhostValidity(Vector2Int gridOrigin)
        {
            bool valid = gridSystem.CanPlace(gridOrigin, _ghostBuilding.Size)
                && _ghostBuilding.CanAfford(resourceController);

            _ghostView?.SetValid(valid);
        }

        private void DestroyGhost()
        {
            if (_ghostInstance != null)
                Destroy(_ghostInstance);

            _ghostInstance = null;
            _ghostBuilding = null;
            _ghostView = null;
        }

        /// <summary>
        /// Raycast von der Kamera durch Touch/Maus auf die Insel (Collider nötig!).
        /// </summary>
        private bool TryRaycastIsland(Vector2 screenPosition, out Vector3 hitPoint)
        {
            hitPoint = Vector3.zero;

            if (placementCamera == null)
                return false;

            Ray ray = placementCamera.ScreenPointToRay(screenPosition);

            if (Physics.Raycast(ray, out RaycastHit hit, raycastMaxDistance, islandLayerMask))
            {
                hitPoint = hit.point;
                return true;
            }

            // Fallback: unsichtbare XZ-Ebene bei Y = gridOrigin.y schneiden
            Plane ground = new Plane(Vector3.up, gridSystem.GridOrigin);
            if (ground.Raycast(ray, out float enter))
            {
                hitPoint = ray.GetPoint(enter);
                return true;
            }

            return false;
        }

        // --- Eingabe: Touch (Mobile) + Maus (Editor) ---

        private bool TryGetPointerDown(out Vector2 screenPos)
        {
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began)
                {
                    screenPos = touch.position;
                    return true;
                }
            }

            if (Input.GetMouseButtonDown(0))
            {
                screenPos = Input.mousePosition;
                return true;
            }

            screenPos = Vector2.zero;
            return false;
        }

        private bool TryGetPointerHeld(out Vector2 screenPos)
        {
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Moved || touch.phase == TouchPhase.Stationary)
                {
                    screenPos = touch.position;
                    return true;
                }
            }

            if (Input.GetMouseButton(0))
            {
                screenPos = Input.mousePosition;
                return true;
            }

            screenPos = Vector2.zero;
            return false;
        }

        private bool TryGetPointerUp(out Vector2 screenPos)
        {
            if (Input.touchCount > 0)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled)
                {
                    screenPos = touch.position;
                    return true;
                }
            }

            if (Input.GetMouseButtonUp(0))
            {
                screenPos = Input.mousePosition;
                return true;
            }

            screenPos = Vector2.zero;
            return false;
        }
    }
}
