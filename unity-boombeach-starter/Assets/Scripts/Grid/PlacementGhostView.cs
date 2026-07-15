using UnityEngine;

namespace Canaboom.Grid
{
    /// <summary>
    /// Steuert die Farbe des Geister-Gebäudes (grün = ok, rot = blockiert).
    /// Wird vom BuildingPlacementController auf dem Ghost-Prefab verwendet.
    ///
    /// Anfänger-Tipp: Lege zwei transparente Materialien im Inspector ab
    /// (z. B. „GhostValid“ grün, „GhostInvalid“ rot) oder nutze die Auto-Farben.
    /// </summary>
    [DisallowMultipleComponent]
    public class PlacementGhostView : MonoBehaviour
    {
        [Header("Materialien (optional) / Materials (optional)")]
        [Tooltip("Transparentes grünes Material — wird bei gültiger Position gezeigt")]
        [SerializeField] private Material validMaterial;

        [Tooltip("Transparentes rotes Material — bei Kollision oder außerhalb des Rasters")]
        [SerializeField] private Material invalidMaterial;

        [Header("Auto-Farben / Auto colors")]
        [SerializeField] private Color validColor = new Color(0.2f, 1f, 0.35f, 0.55f);
        [SerializeField] private Color invalidColor = new Color(1f, 0.25f, 0.2f, 0.55f);

        private Renderer[] _renderers;
        private Material[] _runtimeMaterials;

        private void Awake()
        {
            _renderers = GetComponentsInChildren<Renderer>(includeInactive: true);
            _runtimeMaterials = new Material[_renderers.Length];

            for (int i = 0; i < _renderers.Length; i++)
            {
                // Eigene Material-Instanz, damit das Original-Prefab unverändert bleibt
                _runtimeMaterials[i] = _renderers[i].material;
                SetMaterialTransparent(_runtimeMaterials[i]);
            }

            SetValid(true);
        }

        /// <summary>
        /// true = grün (platzierbar), false = rot (blockiert).
        /// </summary>
        public void SetValid(bool isValid)
        {
            if (_renderers == null || _renderers.Length == 0)
                return;

            for (int i = 0; i < _renderers.Length; i++)
            {
                if (isValid && validMaterial != null)
                {
                    _renderers[i].sharedMaterial = validMaterial;
                    continue;
                }

                if (!isValid && invalidMaterial != null)
                {
                    _renderers[i].sharedMaterial = invalidMaterial;
                    continue;
                }

                _runtimeMaterials[i].color = isValid ? validColor : invalidColor;
                _renderers[i].material = _runtimeMaterials[i];
            }
        }

        /// <summary>
        /// Macht ein Standard-URP/Built-in-Material halbtransparent (Fallback).
        /// </summary>
        private static void SetMaterialTransparent(Material mat)
        {
            if (mat == null)
                return;

            mat.SetFloat("_Mode", 3f); // Built-in Transparent
            mat.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
            mat.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
            mat.SetInt("_ZWrite", 0);
            mat.DisableKeyword("_ALPHATEST_ON");
            mat.EnableKeyword("_ALPHABLEND_ON");
            mat.DisableKeyword("_ALPHAPREMULTIPLY_ON");
            mat.renderQueue = 3000;
        }
    }
}
