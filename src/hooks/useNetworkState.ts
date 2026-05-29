import { useEffect, useState } from "react";

export interface NetworkState {
  /** Whether the browser currently has a network connection. */
  online: boolean;
  /** Effective connection type, e.g. "4g" (when supported). */
  effectiveType?: string;
  /** Estimated downlink speed in Mbps (when supported). */
  downlink?: number;
  /** Estimated round-trip time in ms (when supported). */
  rtt?: number;
  /** Whether the user has requested reduced data usage (when supported). */
  saveData?: boolean;
  /** Timestamp of the last time the connection went online. */
  since?: number;
}

type NavigatorConnection = {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

function getConnection(): NavigatorConnection | undefined {
  if (typeof navigator === "undefined") return undefined;
  const nav = navigator as Navigator & {
    connection?: NavigatorConnection;
    mozConnection?: NavigatorConnection;
    webkitConnection?: NavigatorConnection;
  };
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

function readState(): NetworkState {
  if (typeof navigator === "undefined") return { online: true };
  const connection = getConnection();
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
    since: navigator.onLine ? Date.now() : undefined,
  };
}

/**
 * Tracks online/offline status and (where supported) the Network Information
 * API for connection quality.
 *
 * @example
 * const { online, effectiveType } = useNetworkState();
 */
export function useNetworkState(): NetworkState {
  const [state, setState] = useState<NetworkState>(() => {
    if (typeof navigator === "undefined") return { online: true };
    return readState();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setState(readState());

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    const connection = getConnection();
    connection?.addEventListener?.("change", update);

    update();

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      connection?.removeEventListener?.("change", update);
    };
  }, []);

  return state;
}
