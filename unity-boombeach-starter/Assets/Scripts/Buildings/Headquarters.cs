using Canaboom.Grid;
using UnityEngine;

namespace Canaboom.Buildings
{
    /// <summary>
    /// Hauptquartier (HQ) — Herzstück der Basis.
    /// Headquarters (HQ) — heart of the base.
    ///
    /// Verlustbedingung / Loss condition:
    /// Wird das HQ im Raid zerstört, verliert der Spieler den Angriff.
    /// If HQ is destroyed during a raid, the player loses the attack.
    /// </summary>
    public class Headquarters : Building
    {
        [Header("HQ — Freischaltungen / Unlocks")]
        [Tooltip("HQ-Stufe bestimmt, welche Gebäude freigeschaltet sind")]
        [SerializeField] private int unlockLevel = 1;

        [Tooltip("Maximale Gebäude-Stufe, die bei dieser HQ-Stufe gebaut werden darf")]
        [SerializeField] private int maxBuildingLevel = 1;

        public int UnlockLevel => unlockLevel;
        public int MaxBuildingLevel => maxBuildingLevel;

        public override void OnPlaced(GridSystem grid)
        {
            base.OnPlaced(grid);
            Debug.Log($"[HQ] Hauptquartier Stufe {Level} platziert. Freischalt-Stufe: {unlockLevel}");
        }

        public override void OnDestroyed(GridSystem grid)
        {
            base.OnDestroyed(grid);
            Debug.LogWarning("[HQ] Hauptquartier zerstört — Basis verloren!");
        }

        /// <summary>
        /// Prüft, ob ein Gebäude bei aktueller HQ-Stufe freigeschaltet ist.
        /// Checks whether a building is unlocked at current HQ level.
        /// </summary>
        public bool IsBuildingUnlocked(string requiredBuildingId, int requiredHqLevel)
        {
            return unlockLevel >= requiredHqLevel;
        }

        /// <summary>
        /// HQ upgraden (später: Kosten, Bauzeit).
        /// Upgrade HQ (later: costs, build time).
        /// </summary>
        public void UpgradeHeadquarters()
        {
            unlockLevel++;
            maxBuildingLevel = unlockLevel;
            Debug.Log($"[HQ] Upgrade auf Stufe {unlockLevel}");
        }
    }
}
