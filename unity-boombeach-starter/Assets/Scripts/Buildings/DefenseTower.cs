using UnityEngine;

namespace Canaboom.Buildings
{
    /// <summary>
    /// Verteidigungsturm — schießt auf angreifende Einheiten (Stub).
    /// Defense tower — fires at attacking units (stub).
    /// </summary>
    public class DefenseTower : Building
    {
        [Header("Kampf / Combat")]
        [SerializeField] private int damage = 25;
        [SerializeField] private float range = 8f;
        [SerializeField] private float fireRate = 1f; // Schüsse pro Sekunde / Shots per second

        private float _cooldown;

        public int Damage => damage;
        public float Range => range;
        public float FireRate => fireRate;

        private void Update()
        {
            if (_cooldown > 0f)
                _cooldown -= Time.deltaTime;
        }

        /// <summary>
        /// Greift ein Ziel an, wenn Reichweite und Cooldown es erlauben.
        /// Attacks a target if in range and off cooldown.
        /// </summary>
        public virtual void Attack(Transform target)
        {
            if (target == null || _cooldown > 0f)
                return;

            float distance = Vector3.Distance(transform.position, target.position);
            if (distance > range)
                return;

            _cooldown = 1f / fireRate;

            // Stub: Schaden direkt anwenden wenn Ziel ein Building ist
            // Stub: apply damage directly if target is a Building
            var targetBuilding = target.GetComponent<Building>();
            if (targetBuilding != null)
            {
                targetBuilding.TakeDamage(damage);
                Debug.Log($"[DefenseTower] {BuildingId} trifft {target.name} für {damage} Schaden.");
                return;
            }

            Debug.Log($"[DefenseTower] {BuildingId} feuert auf {target.name} (Stub — kein Schaden-Component).");
        }

        /// <summary>
        /// Sucht das nächste Ziel in Reichweite (einfacher Stub).
        /// Finds nearest target in range (simple stub).
        /// </summary>
        public void AttackNearestTarget()
        {
            var colliders = Physics.OverlapSphere(transform.position, range);
            Transform nearest = null;
            float nearestDist = float.MaxValue;

            foreach (var col in colliders)
            {
                if (col.transform == transform)
                    continue;

                float dist = Vector3.Distance(transform.position, col.transform.position);
                if (dist < nearestDist)
                {
                    nearestDist = dist;
                    nearest = col.transform;
                }
            }

            if (nearest != null)
                Attack(nearest);
        }

#if UNITY_EDITOR
        private void OnDrawGizmosSelected()
        {
            Gizmos.color = new Color(1f, 0.3f, 0.3f, 0.25f);
            Gizmos.DrawWireSphere(transform.position, range);
        }
#endif
    }
}
