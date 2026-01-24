import React from "react"
import styles from "./loot.module.css"
import { Bridge } from "@/types/bridge"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = { bridge: Bridge }

export default function BridgeCard({ bridge }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{bridge.name}</h3>

        <div className={styles.statusWrap}>
          <div className={`${styles.statusDot} ${styles[bridge.status]}`} />
          <div className={styles.badge}>{bridge.status.toUpperCase()}</div>
        </div>
      </div>

      <div className={styles.content}>
        {bridge.tvl && bridge.volume24h && (
          <div className={styles.metrics}>
            <div className={styles.metricBox}>
              <div className={styles.metricLabel}>TVL</div>
              <div className={styles.metricValue}>{bridge.tvl}</div>
            </div>

            <div className={styles.metricBox}>
              <div className={styles.metricLabel}>24H Volume</div>
              <div className={styles.metricValue}>{bridge.volume24h}</div>
            </div>
          </div>
        )}

        <div className={styles.routes}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Supported Routes</div>
          <div style={{ fontSize: "0.9rem" }}>
            <strong>From:</strong> {bridge.fromChains.join(", ")}<br />
            <strong>To:</strong> {bridge.toChains.join(", ")}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Supported Tokens</div>
          <div className={styles.tokens}>
            {bridge.supportedTokens.map((t) => (
              <div key={t} className={styles.token}>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.statsRow}>
          <div>
            <div className={styles.statLabel}>Speed</div>
            <div className={styles.statValue}>{bridge.transferSpeed}</div>
          </div>
          <div>
            <div className={styles.statLabel}>Fee</div>
            <div className={styles.statValue}>{bridge.fee}</div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        {bridge.status === "inactive" ? (
          <div className={styles.disabled}>Bridge Inactive</div>
        ) : (
          <a href={bridge.link} target="_blank" rel="noopener noreferrer" style={{ width: "100%" }}>
            <Button asChild>
              <span className={styles.cta}>
                <span className={styles.ctaText}>{bridge.status === "paused" ? "Bridge Paused" : "USE BRIDGE"}</span>
                {bridge.status === "active" && <ExternalLink className={styles.icon} />}
              </span>
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}
