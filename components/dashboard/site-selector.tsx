"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Site {
  id: string;
  name: string;
  domain: string;
}

interface SiteSelectorProps {
  onSiteChange: (siteId: string) => void;
  selectedSiteId?: string;
}

export function SiteSelector({ onSiteChange, selectedSiteId }: SiteSelectorProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSites() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/sites");
        
        if (!res.ok) {
          throw new Error("Failed to fetch sites");
        }
        
        const data = await res.json();
        setSites(data.sites || []);
        
        // Auto-select first site if none selected
        if (data.sites?.length > 0 && !selectedSiteId) {
          onSiteChange(data.sites[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sites");
      } finally {
        setLoading(false);
      }
    }
    
    fetchSites();
  }, [selectedSiteId, onSiteChange]);

  if (loading) {
    return (
      <div className="w-[280px] h-10 bg-muted animate-pulse rounded-md" />
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        Error loading sites
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No sites found.{" "}
        <a href="/dashboard/sites" className="text-primary hover:underline">
          Create one
        </a>
      </div>
    );
  }

  return (
    <Select
      value={selectedSiteId || sites[0]?.id}
      onValueChange={onSiteChange}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a site" />
      </SelectTrigger>
      <SelectContent>
        {sites.map((site) => (
          <SelectItem key={site.id} value={site.id}>
            <div className="flex flex-col items-start">
              <span className="font-medium">{site.name}</span>
              <span className="text-xs text-muted-foreground">{site.domain}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

