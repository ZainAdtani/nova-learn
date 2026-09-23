import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIAP } from 'expo-iap';

// Auto-renewable subscription sold through the App Store ($2.99 / month).
// IMPORTANT: this must exactly match the Product ID created in App Store Connect.
export const PREMIUM_PRODUCT_ID = 'com.adtaniedu.supernova.premium_monthly';

// Last known entitlement, so the UI never flashes the wrong state on launch.
const PREMIUM_CACHE_KEY = '@nova_learn_premium_entitled';

const PremiumContext = createContext({
  isPremium: false,
  isLoading: true,
  // True when the native store is connected. False in Expo Go and on
  // simulators without StoreKit — IAP needs an EAS dev or production build.
  storeAvailable: false,
  // The subscription product fetched from the store (price, title), or null.
  product: null,
  purchasing: false,
  restoring: false,
  error: null,
  subscribe: async () => false,
  restore: async () => false,
  refresh: async () => {},
  clearError: () => {},
});

function isUserCancelled(error) {
  const code = String(error?.code ?? '').toLowerCase();
  const message = String(error?.message ?? '').toLowerCase();
  return code.includes('cancel') || message.includes('cancel');
}

export function PremiumProvider({ children }) {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState(null);
  const connectedRef = useRef(false);

  const setEntitlement = useCallback(async (value) => {
    setIsPremium(value);
    try {
      await AsyncStorage.setItem(PREMIUM_CACHE_KEY, value ? 'true' : 'false');
    } catch {
      // Cache is best-effort; the store is the source of truth.
    }
  }, []);

  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    restorePurchases,
    hasActiveSubscriptions,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      try {
        // Always finish the transaction so it leaves the purchase queue.
        await finishTransaction({ purchase, isConsumable: false });
      } catch (finishError) {
        console.warn('[Premium] finishTransaction failed:', finishError);
      }
      await setEntitlement(true);
      setPurchasing(false);
    },
    onPurchaseError: (purchaseError) => {
      setPurchasing(false);
      // Backing out of the Apple payment sheet is not an error worth surfacing.
      if (!isUserCancelled(purchaseError)) {
        setError(purchaseError?.message ?? 'Something went wrong during purchase.');
      }
    },
    onError: () => {
      // The store never connected (e.g. Expo Go, no network). Show cached state.
      if (!connectedRef.current) setIsLoading(false);
    },
  });

  useEffect(() => {
    connectedRef.current = connected;
  }, [connected]);

  const checkEntitlement = useCallback(async () => {
    try {
      const active = await hasActiveSubscriptions([PREMIUM_PRODUCT_ID]);
      await setEntitlement(active);
      return active;
    } catch (e) {
      console.warn('[Premium] entitlement check failed:', e);
      return null;
    }
  }, [hasActiveSubscriptions, setEntitlement]);

  // Once the store connects: fetch the subscription product, then check entitlement.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(PREMIUM_CACHE_KEY);
        if (!cancelled && cached === 'true') setIsPremium(true);
      } catch {}
      if (!connected || cancelled) return;
      try {
        await fetchProducts({ skus: [PREMIUM_PRODUCT_ID], type: 'subs' });
        await checkEntitlement();
      } catch (e) {
        console.warn('[Premium] product fetch failed:', e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [connected, fetchProducts, checkEntitlement]);

  // If the store never connects (Expo Go), don't spin forever.
  useEffect(() => {
    if (connected) return;
    const t = setTimeout(() => {
      if (!connectedRef.current) setIsLoading(false);
    }, 8000);
    return () => clearTimeout(t);
  }, [connected]);

  const subscribe = useCallback(async () => {
    setError(null);
    if (!connectedRef.current) {
      setError(
        'The App Store is not reachable right now. Subscriptions need a development or production build of the app — they do not work in Expo Go.'
      );
      return false;
    }
    setPurchasing(true);
    try {
      await requestPurchase({
        request: { apple: { sku: PREMIUM_PRODUCT_ID } },
        type: 'subs',
      });
      // The outcome arrives via onPurchaseSuccess / onPurchaseError.
      return true;
    } catch (e) {
      setPurchasing(false);
      if (!isUserCancelled(e)) {
        setError(e?.message ?? 'Could not start the purchase.');
      }
      return false;
    }
  }, [requestPurchase]);

  const restore = useCallback(async () => {
    setError(null);
    if (!connectedRef.current) {
      setError(
        'The App Store is not reachable right now. Restoring needs a development or production build of the app.'
      );
      return false;
    }
    setRestoring(true);
    try {
      await restorePurchases();
      const active = await checkEntitlement();
      return active === true;
    } catch (e) {
      setError(e?.message ?? 'Could not restore purchases.');
      return false;
    } finally {
      setRestoring(false);
    }
  }, [restorePurchases, checkEntitlement]);

  const refresh = useCallback(async () => {
    if (connectedRef.current) await checkEntitlement();
  }, [checkEntitlement]);

  const clearError = useCallback(() => setError(null), []);

  const product = useMemo(
    () => subscriptions.find((s) => s.id === PREMIUM_PRODUCT_ID) ?? null,
    [subscriptions]
  );

  const value = useMemo(
    () => ({
      isPremium,
      isLoading,
      storeAvailable: connected,
      product,
      purchasing,
      restoring,
      error,
      subscribe,
      restore,
      refresh,
      clearError,
    }),
    [isPremium, isLoading, connected, product, purchasing, restoring, error, subscribe, restore, refresh, clearError]
  );

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
}

export function usePremium() {
  return useContext(PremiumContext);
}
