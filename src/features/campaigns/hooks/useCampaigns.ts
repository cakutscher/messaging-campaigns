import React from 'react';

import { uid } from '@/lib/uid';
import { sendMessage } from '../api/messagingApi';
import type { Campaign, CampaignInput, Recipient } from '../domain/types';

export function useCampaigns() {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [recipientsMap, setRecipientsMap] = React.useState<
    Record<string, Recipient[]>
  >({});
  const executionAbortController = React.useRef<AbortController | null>(null);

  const handleCreate = React.useCallback((input: CampaignInput) => {
    const newCampaign: Campaign = {
      id: `cmp_${uid()}`,
      name: input.name,
      content: input.content,
      status: 'draft',
      createdAt: new Date().toISOString(),
      recipients: [],
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    setSelectedId(newCampaign.id);
  }, []);

  const handleImportRecipients = React.useCallback(
    (campaignId: string, recipients: Recipient[]) => {
      setRecipientsMap((m) => ({ ...m, [campaignId]: recipients }));

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId && c.status === 'draft'
            ? { ...c, status: 'ready' }
            : c
        )
      );
    },
    []
  );

  const handleExecute = React.useCallback(
    async (campaignId: string) => {
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (!campaign) return;

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId ? { ...c, status: 'running' } : c
        )
      );

      const recipients = recipientsMap[campaignId] || [];
      executionAbortController.current = new AbortController();

      for (const recipient of recipients) {
        if (executionAbortController.current.signal.aborted) {
          break;
        }

        const result = await sendMessage({
          recipientPhoneNumber: recipient.phone,
          service: recipient.channel,
          message: campaign.content,
        });

        setRecipientsMap((m) => {
          const next: Recipient[] = (m[campaignId] || []).map((r) =>
            r.id !== recipient.id
              ? r
              : {
                  ...r,
                  status: result.ok ? 'sent' : 'error',
                  errorMessage: result.ok ? null : result.error,
                }
          );
          return { ...m, [campaignId]: next };
        });
      }

      if (executionAbortController.current.signal.aborted) {
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === campaignId ? { ...c, status: 'cancelled' } : c
          )
        );
      } else {
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === campaignId ? { ...c, status: 'completed' } : c
          )
        );
      }
      executionAbortController.current = null;
    },
    [campaigns, recipientsMap]
  );

  const handleCancel = React.useCallback(
    (campaignId: string) => {
      if (executionAbortController.current) {
        executionAbortController.current.abort();
      } else {
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === campaignId ? { ...c, status: 'cancelled' } : c
          )
        );
      }
    },
    []
  );

  const selectedCampaign = selectedId
    ? campaigns.find((c) => c.id === selectedId) ?? null
    : null;

  const selectedRecipients = selectedId ? recipientsMap[selectedId] || [] : [];

  return {
    campaigns,
    selectedId,
    selectedCampaign,
    selectedRecipients,
    handleCreate,
    handleImportRecipients,
    handleExecute,
    handleCancel,
    setSelectedId,
  };
}
