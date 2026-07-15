using Canaboom.Grid;
using Canaboom.Resources;
using UnityEngine;

namespace Canaboom.Buildings
{
    /// <summary>
    /// Basisklasse für alle platzierbaren Gebäude.
    /// Base class for all placeable buildings.
    /// </summary>
    public class Building : MonoBehaviour
    {
        [Header("Identität / Identity")]
        [SerializeField] private string buildingId = "building_generic";
        [SerializeField] private int level = 1;

        [Header("Raster / Grid")]
        [SerializeField] private Vector2Int size = Vector2Int.one;

        [Header("Kampf / Combat")]
        [SerializeField] private int maxHp = 100;
        [SerializeField] private int currentHp = 100;

        [Header("Kosten / Costs")]
        [SerializeField] private int goldCost;
        [SerializeField] private int woodCost;
        [SerializeField] private int stoneCost;

        [Header("Produktion (pro Tick) / Production per tick")]
        [SerializeField] private int goldPerTick;
        [SerializeField] private int woodPerTick;
        [SerializeField] private int stonePerTick;

        public string BuildingId => buildingId;
        public int Level => level;
        public Vector2Int Size => size;
        public int MaxHp => maxHp;
        public int CurrentHp => currentHp;
        public int GoldCost => goldCost;
        public int WoodCost => woodCost;
        public int StoneCost => stoneCost;

        /// <summary>
        /// Raster-Ursprung (linke untere Ecke) nach Platzierung.
        /// Grid origin (bottom-left corner) after placement.
        /// </summary>
        public Vector2Int GridOrigin { get; set; }

        /// <summary>
        /// Wird nach erfolgreicher Platzierung aufgerufen.
        /// Called after successful placement.
        /// </summary>
        public virtual void OnPlaced(GridSystem grid)
        {
            Vector3 center = grid.GetBuildingWorldCenter(GridOrigin, size);
            transform.position = center;
            currentHp = maxHp;
        }

        /// <summary>
        /// Wird beim Entfernen/Zerstören aufgerufen.
        /// Called when removed/destroyed.
        /// </summary>
        public virtual void OnDestroyed(GridSystem grid)
        {
            // Unterklassen können Partikeleffekte etc. auslösen
            // Subclasses may trigger particle effects etc.
        }

        /// <summary>
        /// Produktions-Tick vom ResourceSystem.
        /// Production tick from ResourceSystem.
        /// </summary>
        public virtual void TickProduction(ResourceSystem resources)
        {
            if (goldPerTick > 0)
                resources.AddResource(ResourceType.Gold, goldPerTick);
            if (woodPerTick > 0)
                resources.AddResource(ResourceType.Wood, woodPerTick);
            if (stonePerTick > 0)
                resources.AddResource(ResourceType.Stone, stonePerTick);
        }

        /// <summary>
        /// Schaden nehmen; zerstört bei HP ≤ 0.
        /// Take damage; destroyed at HP ≤ 0.
        /// </summary>
        public virtual void TakeDamage(int damage)
        {
            currentHp = Mathf.Max(0, currentHp - damage);
            if (currentHp <= 0)
                DestroyBuilding();
        }

        /// <summary>
        /// Gebäude zerstören und aus dem Raster entfernen.
        /// Destroy building and remove from grid.
        /// </summary>
        public void DestroyBuilding()
        {
            var grid = FindFirstObjectByType<GridSystem>();
            grid?.RemoveBuilding(this);
            Destroy(gameObject);
        }

        /// <summary>
        /// Prüft Kosten über ResourceController (UI + passive Produktion).
        /// </summary>
        public bool CanAfford(ResourceController resources)
        {
            return resources.CanAfford(goldCost, woodCost, stoneCost);
        }

        /// <summary>
        /// Prüft, ob der Spieler das Gebäude leisten kann (ResourceSystem).
        /// </summary>
        public bool CanAfford(ResourceSystem resources)
        {
            return resources.CanAfford(goldCost, woodCost, stoneCost);
        }

        /// <summary>
        /// Kauft über ResourceController.Spend().
        /// </summary>
        public bool TryPurchase(ResourceController resources)
        {
            return resources.Spend(goldCost, woodCost, stoneCost);
        }

        /// <summary>
        /// Kauft über ResourceSystem.TrySpend().
        /// </summary>
        public bool TryPurchase(ResourceSystem resources)
        {
            return resources.TrySpend(goldCost, woodCost, stoneCost);
        }
    }
}
