using Canaboom.Buildings;
using Canaboom.Grid;
using Canaboom.Resources;
using UnityEngine;

namespace Canaboom.Core
{
    /// <summary>
    /// Zentraler Spiel-Controller: verbindet Raster, Ressourcen, HQ-Start und Platzierung.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        [Header("Referenzen / References")]
        [SerializeField] private GridSystem gridSystem;
        [SerializeField] private ResourceController resourceController;
        [SerializeField] private BuildingPlacementController placementController;

        [Header("Start-HQ / Starting HQ")]
        [SerializeField] private GameObject headquartersPrefab;
        [SerializeField] private Vector2Int hqGridPosition = new Vector2Int(8, 8);

        private Headquarters _headquarters;

        private void Awake()
        {
            if (gridSystem == null)
                gridSystem = FindFirstObjectByType<GridSystem>();
            if (resourceController == null)
                resourceController = FindFirstObjectByType<ResourceController>();
            if (placementController == null)
                placementController = FindFirstObjectByType<BuildingPlacementController>();
        }

        private void Start()
        {
            PlaceStartingHeadquarters();
        }

        private void PlaceStartingHeadquarters()
        {
            if (headquartersPrefab == null || gridSystem == null)
            {
                Debug.LogWarning("[GameManager] HQ-Prefab oder GridSystem fehlt.");
                return;
            }

            GameObject hqObject = Instantiate(headquartersPrefab);
            _headquarters = hqObject.GetComponent<Headquarters>();

            if (_headquarters == null)
            {
                Debug.LogError("[GameManager] Headquarters-Prefab braucht Headquarters-Component.");
                Destroy(hqObject);
                return;
            }

            if (!gridSystem.PlaceBuilding(_headquarters, hqGridPosition))
            {
                Debug.LogError($"[GameManager] HQ kann nicht bei {hqGridPosition} platziert werden.");
                Destroy(hqObject);
            }
            else
            {
                Debug.Log($"[GameManager] HQ platziert bei Raster {hqGridPosition}.");
            }
        }

        public bool TryPlaceBuilding(GameObject prefab, Vector2Int gridPos)
        {
            if (prefab == null || gridSystem == null || resourceController == null)
                return false;

            var buildingComponent = prefab.GetComponent<Building>();
            if (buildingComponent == null)
            {
                Debug.LogError("[GameManager] Prefab hat keine Building-Component.");
                return false;
            }

            if (!gridSystem.CanPlace(gridPos, buildingComponent.Size))
            {
                Debug.Log($"[GameManager] Platz bei {gridPos} nicht frei.");
                return false;
            }

            if (!buildingComponent.CanAfford(resourceController))
            {
                Debug.Log("[GameManager] Nicht genug Ressourcen.");
                return false;
            }

            GameObject instance = Instantiate(prefab);
            var building = instance.GetComponent<Building>();

            if (!building.TryPurchase(resourceController))
            {
                Destroy(instance);
                return false;
            }

            if (!gridSystem.PlaceBuilding(building, gridPos))
            {
                resourceController.Refund(building.GoldCost, building.WoodCost, building.StoneCost);
                Destroy(instance);
                return false;
            }

            Debug.Log($"[GameManager] {building.BuildingId} platziert bei {gridPos}.");
            return true;
        }

        public GridSystem Grid => gridSystem;
        public ResourceController Resources => resourceController;
        public Headquarters Headquarters => _headquarters;
        public BuildingPlacementController Placement => placementController;
    }
}
