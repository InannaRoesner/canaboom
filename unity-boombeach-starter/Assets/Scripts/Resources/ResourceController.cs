using UnityEngine;
using UnityEngine.UI;

namespace Canaboom.Resources
{
    /// <summary>
    /// Einfacher Ressourcen-Controller mit UI-Anzeige und passiver Produktion.
    ///
    /// Anfänger-Erklärung:
    /// - Jede Frame (Update) werden Gold/Holz/Stein automatisch erhöht.
    /// - Die Text-Felder im Canvas zeigen die aktuellen Werte an.
    /// - Beim Bauen ruft BuildingPlacementController Spend() auf.
    ///
    /// Hänge dieses Script an „GameSystems“ und verbinde die Text-Objekte im Inspector.
    /// </summary>
    public class ResourceController : MonoBehaviour
    {
        [Header("Aktuelle Ressourcen")]
        [Tooltip("Wie viel Gold der Spieler gerade hat")]
        public float gold = 100f;

        [Tooltip("Wie viel Holz der Spieler gerade hat")]
        public float holz = 50f;

        [Tooltip("Stein — optional, für spätere Gebäude")]
        public float stein = 0f;

        [Header("Passive Produktion pro Sekunde")]
        [Tooltip("Gold pro Sekunde (wird in Update addiert)")]
        public float goldProSekunde = 2f;

        [Tooltip("Holz pro Sekunde")]
        public float holzProSekunde = 1f;

        [Tooltip("Stein pro Sekunde — 0 = aus")]
        public float steinProSekunde = 0f;

        [Header("Speicher-Limit (0 = unbegrenzt)")]
        [Tooltip("Maximales Gold — 0 bedeutet kein Limit")]
        public float maxGold = 0f;

        [Tooltip("Maximales Holz — 0 bedeutet kein Limit")]
        public float maxHolz = 0f;

        [Tooltip("Maximales Stein — 0 bedeutet kein Limit")]
        public float maxStein = 0f;

        [Header("UI-Anzeige (optional)")]
        [Tooltip("Text-Objekt im Canvas für Gold — per Drag & Drop zuweisen")]
        public Text goldText;

        [Tooltip("Text-Objekt im Canvas für Holz")]
        public Text holzText;

        [Tooltip("Text-Objekt im Canvas für Stein — kann leer bleiben")]
        public Text steinText;

        /// <summary>
        /// Unity ruft Update() jeden Frame auf (~60× pro Sekunde).
        /// Time.deltaTime = vergangene Zeit seit letztem Frame (für gleichmäßige Produktion).
        /// </summary>
        void Update()
        {
            // Passive Einkommen — genau wie in deinem Original-Script
            gold += goldProSekunde * Time.deltaTime;
            holz += holzProSekunde * Time.deltaTime;
            stein += steinProSekunde * Time.deltaTime;

            BegrenzeAufMaximum();

            // UI aktualisieren (nur wenn Text zugewiesen ist)
            if (goldText != null)
                goldText.text = "Gold: " + Mathf.FloorToInt(gold);

            if (holzText != null)
                holzText.text = "Holz: " + Mathf.FloorToInt(holz);

            if (steinText != null)
                steinText.text = "Stein: " + Mathf.FloorToInt(stein);
        }

        /// <summary>
        /// Prüft, ob genug Ressourcen für Gebäudekosten vorhanden sind.
        /// Wird vom BuildingPlacementController und GameManager aufgerufen.
        /// </summary>
        public bool CanAfford(int goldKosten, int holzKosten, int steinKosten = 0)
        {
            return gold >= goldKosten
                && holz >= holzKosten
                && stein >= steinKosten;
        }

        /// <summary>
        /// Zieht Ressourcen ab (z. B. beim Platzieren eines Gebäudes).
        /// Gibt false zurück, wenn nicht genug vorhanden — dann wird NICHTS abgezogen.
        /// </summary>
        public bool Spend(int goldKosten, int holzKosten, int steinKosten = 0)
        {
            if (!CanAfford(goldKosten, holzKosten, steinKosten))
                return false;

            gold -= goldKosten;
            holz -= holzKosten;
            stein -= steinKosten;
            return true;
        }

        /// <summary>
        /// Ressourcen zurückgeben (z. B. wenn Platzierung fehlschlägt).
        /// </summary>
        public void Refund(int goldBetrag, int holzBetrag, int steinBetrag = 0)
        {
            gold += goldBetrag;
            holz += holzBetrag;
            stein += steinBetrag;
            BegrenzeAufMaximum();
        }

        /// <summary>
        /// Alias für Refund — deutsch benannt.
        /// </summary>
        public void Erstatten(int goldBetrag, int holzBetrag, int steinBetrag = 0)
            => Refund(goldBetrag, holzBetrag, steinBetrag);

        /// <summary>
        /// Hält Ressourcen unter dem Maximum, falls Limits gesetzt sind.
        /// </summary>
        private void BegrenzeAufMaximum()
        {
            if (maxGold > 0f)
                gold = Mathf.Min(gold, maxGold);

            if (maxHolz > 0f)
                holz = Mathf.Min(holz, maxHolz);

            if (maxStein > 0f)
                stein = Mathf.Min(stein, maxStein);
        }
    }
}
