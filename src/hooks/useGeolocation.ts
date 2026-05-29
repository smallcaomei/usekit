import { useEffect, useState } from "react";

export interface GeolocationState {
  loading: boolean;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationPositionError | Error | null;
}

const INITIAL: GeolocationState = {
  loading: true,
  accuracy: null,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  latitude: null,
  longitude: null,
  speed: null,
  timestamp: null,
  error: null,
};

/**
 * Tracks the user's geolocation. By default it watches for updates; pass
 * `{ watch: false }` for a one-shot read.
 *
 * @example
 * const { latitude, longitude, loading, error } = useGeolocation();
 */
export function useGeolocation(
  options: PositionOptions & { watch?: boolean } = {},
): GeolocationState {
  const { watch = true, ...positionOptions } = options;
  const [state, setState] = useState<GeolocationState>(INITIAL);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: new Error("Geolocation is not supported"),
      }));
      return;
    }

    let mounted = true;

    const onSuccess = (position: GeolocationPosition) => {
      if (!mounted) return;
      const { coords, timestamp } = position;
      setState({
        loading: false,
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        latitude: coords.latitude,
        longitude: coords.longitude,
        speed: coords.speed,
        timestamp,
        error: null,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      if (!mounted) return;
      setState((s) => ({ ...s, loading: false, error }));
    };

    let watchId: number | null = null;
    if (watch) {
      watchId = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        positionOptions,
      );
    } else {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        onError,
        positionOptions,
      );
    }

    return () => {
      mounted = false;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, positionOptions.enableHighAccuracy, positionOptions.maximumAge, positionOptions.timeout]);

  return state;
}
