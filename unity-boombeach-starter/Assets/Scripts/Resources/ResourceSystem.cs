using System;
using UnityEngine;

namespace Canaboom.Resources
{
    /// <summary>
    /// Verwaltet Spieler-Ressourcen (Gold, Holz; später Stein).
    /// Manages player resources (gold, wood; stone later).
    /// </summary>
    public class ResourceSystem : MonoBehaviour
    {
        [Header("Startwerte / Starting values")]
        [SerializeField] private int startingGold = 500;
        [SerializeField] private int startingWood = 300;

        [Header("Persistenz / Persistence")]
        [Tooltip("Ressourcen in PlayerPrefs speichern / Save resources to PlayerPrefs")]
        [SerializeField] private bool persistWithPlayerPrefs = true;

        [Header("Produktion / Production")]
        [Tooltip("Sekunden zwischen Produktions-Ticks / Seconds between production ticks")]
        [SerializeField] private float productionInterval = 1f;

        public int Gold { get; private set; }
        public int Wood { get; private set; }
        // Stone kommt später / Stone comes later
        public int Stone { get; private set; }

        public event Action OnResourcesChanged;

        private float _productionTimer;

        private const string PrefsGoldKey = "canaboom_gold";
        private const string PrefsWoodKey = "canaboom_wood";
        private const string PrefsStoneKey = "canaboom_stone";

        private void Awake()
        {
            if (persistWithPlayerPrefs && PlayerPrefs.HasKey(PrefsGoldKey))
            {
                Gold = PlayerPrefs.GetInt(PrefsGoldKey, startingGold);
                Wood = PlayerPrefs.GetInt(PrefsWoodKey, startingWood);
                Stone = PlayerPrefs.GetInt(PrefsStoneKey, 0);
            }
            else
            {
                Gold = startingGold;
                Wood = startingWood;
                Stone = 0;
            }
        }

        private void Update()
        {
            _productionTimer += Time.deltaTime;
            if (_productionTimer < productionInterval)
                return;

            _productionTimer -= productionInterval;
            TickProduction();
        }

        /// <summary>
        /// Ressource hinzufügen / Add resource.
        /// </summary>
        public void AddResource(ResourceType type, int amount)
        {
            if (amount <= 0)
                return;

            switch (type)
            {
                case ResourceType.Gold: Gold += amount; break;
                case ResourceType.Wood: Wood += amount; break;
                case ResourceType.Stone: Stone += amount; break;
            }

            NotifyChanged();
        }

        /// <summary>
        /// Ressource ausgeben; gibt false zurück wenn nicht genug vorhanden.
        /// Spend resource; returns false if insufficient funds.
        /// </summary>
        public bool SpendResource(ResourceType type, int amount)
        {
            if (amount <= 0)
                return true;

            if (!CanAfford(type, amount))
                return false;

            switch (type)
            {
                case ResourceType.Gold: Gold -= amount; break;
                case ResourceType.Wood: Wood -= amount; break;
                case ResourceType.Stone: Stone -= amount; break;
            }

            NotifyChanged();
            return true;
        }

        /// <summary>
        /// Prüft, ob genug von einer Ressource vorhanden ist.
        /// Checks whether enough of a resource is available.
        /// </summary>
        public bool CanAfford(ResourceType type, int amount)
        {
            return type switch
            {
                ResourceType.Gold => Gold >= amount,
                ResourceType.Wood => Wood >= amount,
                ResourceType.Stone => Stone >= amount,
                _ => false
            };
        }

        /// <summary>
        /// Prüft Gold- und Holzkosten gleichzeitig.
        /// Checks gold and wood costs at once.
        /// </summary>
        public bool CanAfford(int goldCost, int woodCost, int stoneCost = 0)
        {
            return Gold >= goldCost && Wood >= woodCost && Stone >= stoneCost;
        }

        /// <summary>
        /// Zieht Gold/Holz/Stein ab; false wenn nicht leistbar.
        /// Deducts gold/wood/stone; false if unaffordable.
        /// </summary>
        public bool TrySpend(int goldCost, int woodCost, int stoneCost = 0)
        {
            if (!CanAfford(goldCost, woodCost, stoneCost))
                return false;

            Gold -= goldCost;
            Wood -= woodCost;
            Stone -= stoneCost;
            NotifyChanged();
            return true;
        }

        /// <summary>
        /// Produktions-Tick: alle Gebäude mit TickProduction aufrufen.
        /// Production tick: call TickProduction on all buildings.
        /// </summary>
        public void TickProduction()
        {
            var buildings = FindObjectsByType<Building>(FindObjectsSortMode.None);
            foreach (Building building in buildings)
                building.TickProduction(this);
        }

        private void NotifyChanged()
        {
            OnResourcesChanged?.Invoke();

            if (persistWithPlayerPrefs)
                SaveToPlayerPrefs();
        }

        private void SaveToPlayerPrefs()
        {
            PlayerPrefs.SetInt(PrefsGoldKey, Gold);
            PlayerPrefs.SetInt(PrefsWoodKey, Wood);
            PlayerPrefs.SetInt(PrefsStoneKey, Stone);
            PlayerPrefs.Save();
        }

        /// <summary>
        /// Setzt Ressourcen zurück (z. B. für Tests).
        /// Resets resources (e.g. for testing).
        /// </summary>
        public void ResetResources()
        {
            Gold = startingGold;
            Wood = startingWood;
            Stone = 0;
            NotifyChanged();
        }
    }

    public enum ResourceType
    {
        Gold,
        Wood,
        Stone
    }
}
