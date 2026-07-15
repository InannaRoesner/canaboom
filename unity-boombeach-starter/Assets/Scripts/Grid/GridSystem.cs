using System.Collections.Generic;
using Canaboom.Buildings;
using UnityEngine;

namespace Canaboom.Grid
{
    /// <summary>
    /// Isometrisches Raster für Gebäudeplatzierung auf der Insel.
    /// Isometric grid for building placement on the island.
    ///
    /// Koordinatensystem / Coordinate system:
    /// - Unity-Standard: XZ-Ebene (Y = Höhe). Die Insel liegt flach auf dem Boden.
    /// - Unity standard: XZ plane (Y = up). The island lies flat on the ground.
    /// - Kamera: Orthografisch, ~45° Yaw / ~35° Pitch (siehe README).
    /// - XY-Ebene wird NICHT verwendet (nur für 2D-Spiele üblich).
    /// </summary>
    public class GridSystem : MonoBehaviour
    {
        [Header("Raster / Grid")]
        [Tooltip("Breite und Tiefe des Rasters in Zellen")]
        [SerializeField] private Vector2Int gridSize = new Vector2Int(20, 20);

        [Tooltip("Weltgröße einer Zelle in Metern")]
        [SerializeField] private float cellSize = 1f;

        [Tooltip("Weltposition der Raster-Ecke (0,0) — linke/vordere Ecke der Insel")]
        [SerializeField] private Vector3 gridOrigin = Vector3.zero;

        [Header("Isometrie / Isometry")]
        [Tooltip("True = diamantförmiges Iso-Raster; False = orthogonales Raster auf XZ")]
        [SerializeField] private bool useIsometricProjection = true;

        // Belegungskarte: jede Rasterzelle zeigt auf das Gebäude, das sie belegt
        private readonly Dictionary<Vector2Int, Building> _occupancy = new();

        public Vector2Int GridSize => gridSize;
        public float CellSize => cellSize;
        public Vector3 GridOrigin => gridOrigin;
        public bool UseIsometricProjection => useIsometricProjection;

        /// <summary>
        /// Rasterkoordinate → Weltposition (Zellmitte auf XZ-Ebene).
        /// </summary>
        public Vector3 GridToWorld(Vector2Int gridPos)
        {
            if (useIsometricProjection)
            {
                float worldX = (gridPos.x - gridPos.y) * (cellSize * 0.5f);
                float worldZ = (gridPos.x + gridPos.y) * (cellSize * 0.25f);
                return gridOrigin + new Vector3(worldX, 0f, worldZ);
            }

            return gridOrigin + new Vector3(gridPos.x * cellSize, 0f, gridPos.y * cellSize);
        }

        /// <summary>
        /// Weltposition → Rasterkoordinate (gerundet auf nächste Zelle).
        /// </summary>
        public Vector2Int WorldToGrid(Vector3 worldPos)
        {
            Vector3 local = worldPos - gridOrigin;

            if (useIsometricProjection)
            {
                float gridX = (local.x / (cellSize * 0.5f) + local.z / (cellSize * 0.25f)) * 0.5f;
                float gridY = (local.z / (cellSize * 0.25f) - local.x / (cellSize * 0.5f)) * 0.5f;
                return new Vector2Int(Mathf.RoundToInt(gridX), Mathf.RoundToInt(gridY));
            }

            return new Vector2Int(
                Mathf.RoundToInt(local.x / cellSize),
                Mathf.RoundToInt(local.z / cellSize)
            );
        }

        /// <summary>
        /// Mittelpunkt eines mehrzelligen Gebäudes in Weltkoordinaten.
        /// Nützlich für Ghost-Vorschau und Kamera-Fokus.
        /// </summary>
        public Vector3 GetBuildingWorldCenter(Vector2Int origin, Vector2Int size)
        {
            Vector3 sum = Vector3.zero;
            int count = 0;

            foreach (Vector2Int cell in GetOccupiedCells(origin, size))
            {
                sum += GridToWorld(cell);
                count++;
            }

            return count > 0 ? sum / count : GridToWorld(origin);
        }

        /// <summary>
        /// Liegt die Zelle innerhalb des Rasters?
        /// </summary>
        public bool IsInsideGrid(Vector2Int cell)
        {
            return cell.x >= 0 && cell.y >= 0
                && cell.x < gridSize.x && cell.y < gridSize.y;
        }

        /// <summary>
        /// Ist die Zelle bereits von einem Gebäude belegt?
        /// </summary>
        public bool IsCellOccupied(Vector2Int cell)
        {
            return _occupancy.ContainsKey(cell);
        }

        /// <summary>
        /// Kann ein Gebäude mit origin + size platziert werden?
        /// Alle Zellen müssen im Raster liegen und frei sein.
        /// </summary>
        public bool CanPlace(Vector2Int origin, Vector2Int size)
        {
            foreach (Vector2Int cell in GetOccupiedCells(origin, size))
            {
                if (!IsInsideGrid(cell) || IsCellOccupied(cell))
                    return false;
            }

            return true;
        }

        /// <summary>
        /// Platziert ein Gebäude und markiert alle betroffenen Zellen in der Belegungskarte.
        /// </summary>
        public bool PlaceBuilding(Building building, Vector2Int origin)
        {
            if (building == null || !CanPlace(origin, building.Size))
                return false;

            building.GridOrigin = origin;

            foreach (Vector2Int cell in GetOccupiedCells(origin, building.Size))
                _occupancy[cell] = building;

            building.OnPlaced(this);
            return true;
        }

        /// <summary>
        /// Entfernt ein Gebäude vollständig aus der Belegungskarte.
        /// </summary>
        public void RemoveBuilding(Building building)
        {
            if (building == null)
                return;

            var cellsToRemove = new List<Vector2Int>();

            foreach (var kvp in _occupancy)
            {
                if (kvp.Value == building)
                    cellsToRemove.Add(kvp.Key);
            }

            foreach (Vector2Int cell in cellsToRemove)
                _occupancy.Remove(cell);

            building.OnDestroyed(this);
        }

        /// <summary>
        /// Gibt das Gebäude an einer Rasterzelle zurück (null wenn frei).
        /// </summary>
        public Building GetBuildingAt(Vector2Int gridPos)
        {
            _occupancy.TryGetValue(gridPos, out Building building);
            return building;
        }

        /// <summary>
        /// Alle Zellen, die ein Gebäude mit origin + size belegt (z. B. HQ 4×4).
        /// </summary>
        public IEnumerable<Vector2Int> GetOccupiedCells(Vector2Int origin, Vector2Int size)
        {
            for (int x = 0; x < size.x; x++)
            {
                for (int y = 0; y < size.y; y++)
                    yield return new Vector2Int(origin.x + x, origin.y + y);
            }
        }

        /// <summary>
        /// Anzahl belegter Zellen (Debug).
        /// </summary>
        public int OccupiedCellCount => _occupancy.Count;
    }
}
