import {
  apiCancelCampaign,
  apiCreateCampaign,
  apiExecuteCampaign,
  apiListCampaigns,
  apiListRecipients,
  apiUploadRecipients,
} from '@campaigns/api/campaigns';
import type { Campaign, CampaignInput, Recipient } from '@campaigns/domain/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedId, _setSelectedId] = useState<string | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<number | null>(null);

  const setSelectedId = useCallback((id: string | null) => {
    _setSelectedId(id);
    setSelectedRecipients([]);
  }, []);

  const refreshCampaigns = useCallback(async () => {
    const data = (await apiListCampaigns()) as Campaign[];
    setCampaigns(data);

    if (!selectedId && data.length > 0) {
      setSelectedId(data[0].id);
    }
  }, [selectedId, setSelectedId]);

  const refreshRecipients = useCallback(async (campaignId: string) => {
    const data = (await apiListRecipients(campaignId)) as Recipient[];
    setSelectedRecipients(data);
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError(null);
        await refreshCampaigns();
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : 'Failed to load campaigns');
      }
    })();

    return () => {
      alive = false;
    };
  }, [refreshCampaigns]);

  useEffect(() => {
    if (!selectedId) return;

    let alive = true;

    (async () => {
      try {
        setError(null);
        await refreshRecipients(selectedId);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : 'Failed to load recipients');
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedId, refreshRecipients]);

  const selectedCampaign = useMemo(
    () => (selectedId ? (campaigns.find((c) => c.id === selectedId) ?? null) : null),
    [campaigns, selectedId],
  );

  useEffect(() => {
    if (!selectedId) return;

    if (pollingRef.current) window.clearInterval(pollingRef.current);

    pollingRef.current = window.setInterval(async () => {
      try {
        await refreshCampaigns();
        await refreshRecipients(selectedId);
      } catch {
        // ignore
      }
    }, 1000);

    return () => {
      if (pollingRef.current) window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    };
  }, [selectedId, refreshCampaigns, refreshRecipients /*, selectedCampaign?.status */]);

  const handleCreate = useCallback(
    async (input: CampaignInput) => {
      setError(null);
      const created = (await apiCreateCampaign({
        name: input.name.trim(),
        content: input.content.trim(),
      })) as Campaign;

      await refreshCampaigns();
      setSelectedId(created.id);
    },
    [refreshCampaigns, setSelectedId],
  );

  const handleImportRecipients = useCallback(
    async (campaignId: string, recipients: Recipient[]) => {
      setError(null);

      const payload = recipients.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        channel: r.channel,
      }));

      await apiUploadRecipients(campaignId, payload);

      await refreshCampaigns();
      if (selectedId === campaignId) {
        await refreshRecipients(campaignId);
      }
    },
    [refreshCampaigns, refreshRecipients, selectedId],
  );

  const handleExecute = useCallback(
    async (campaignId: string) => {
      setError(null);
      await apiExecuteCampaign(campaignId);
      await refreshCampaigns();
    },
    [refreshCampaigns],
  );

  const handleCancel = useCallback(
    async (campaignId: string) => {
      setError(null);
      await apiCancelCampaign(campaignId);
      await refreshCampaigns();
      if (selectedId === campaignId) {
        await refreshRecipients(campaignId);
      }
    },
    [refreshCampaigns, refreshRecipients, selectedId],
  );

  return {
    campaigns,
    selectedId,
    selectedCampaign,
    selectedRecipients,
    error,
    handleCreate,
    handleImportRecipients,
    handleExecute,
    handleCancel,
    setSelectedId,
  };
}
