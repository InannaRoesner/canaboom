using UnityEngine;

namespace Canaboom.Grid
{
    /// <summary>
    /// Zeichnet ein dünnes Raster-Gitter als Gizmos im Scene-Fenster (nur Editor).
    /// Hänge dieses Script an dasselbe GameObject wie GridSystem.
    ///
    /// Gizmos sind nur im Editor sichtbar — nicht im fertigen Spiel auf dem Handy.
    /// </summary>
    [RequireComponent(typeof(GridSystem))]
    public class GridOverlayDrawer : MonoBehaviour
    {
        [SerializeField] private bool drawWhenNotSelected = true;
        [SerializeField] private Color gridLineColor = new Color(0.2f, 0.85f, 1f, 0.4f);
        [SerializeField] private Color occupiedCellColor = new Color(1f, 0.5f, 0.2f, 0.35f);
        [SerializeField] private float lineHeight = 0.06f;

        private GridSystem _grid;

        private void Awake()
        {
            _grid = GetComponent<GridSystem>();
        }

#if UNITY_EDITOR
        private void OnDrawGizmos()
        {
            if (!drawWhenNotSelected)
                return;

            DrawGridOverlay();
        }

        private void OnDrawGizmosSelected()
        {
            if (drawWhenNotSelected)
                return;

            DrawGridOverlay();
        }

        private void DrawGridOverlay()
        {
            if (_grid == null)
                _grid = GetComponent<GridSystem>();
            if (_grid == null)
                return;

            Vector2Int size = _grid.GridSize;

            for (int x = 0; x < size.x; x++)
            {
                for (int y = 0; y < size.y; y++)
                {
                    var cell = new Vector2Int(x, y);
                    Vector3 center = _grid.GridToWorld(cell) + Vector3.up * lineHeight;
                    Vector3 cubeSize = new Vector3(_grid.CellSize * 0.92f, 0.05f, _grid.CellSize * 0.92f);

                    Gizmos.color = _grid.IsCellOccupied(cell) ? occupiedCellColor : gridLineColor;
                    Gizmos.DrawWireCube(center, cubeSize);
                }
            }
        }
#endif
    }
}
