// services/config.ts

import { TenantConfig } from "../types";
import { wimMasterData } from "./wimMasterData";
// For Phisedelia, we would conceptually import its master data, rules, and doctrine here.
// For this demo, we will inline simplified versions.
// import { phisedeliaMasterData } from "./ada.sea.phisedelia/phisedeliaMasterData";
// import { phisedeliaRules } from "./ada.sea.phisedelia/config/sea_phisedelia_rules";
// import { phisedeliaClaude } from "./ada.sea.phisedelia/CLAUDE";


// The Federation Registry (Global Maritime Network)
// These are the nodes that ADA.MARINA.WIM can "handshake" with.
export const FEDERATION_REGISTRY: { peers: TenantConfig[] } = {
  peers: [
    {
      id: 'wim',
      name: 'West Istanbul Marina',
      fullName: 'ADA.MARINA.WIM',
      network: 'wim.ada.network',
      node_address: 'ada.marina.wim',
      status: 'ONLINE',
      api_endpoint: 'https://api.wim.network',
      region: 'TR_MARMARA',
      tier: 'PRESTIGE_HUB',
      mission: `West İstanbul Marina’daki tüm operasyonel akışı (giriş–çıkış, bağlama, güvenlik, faturalama, raporlama) Ada.marina node’u üzerinden yarı-otonom / otonom yönetmek.`,
      contextSources: [
          'docs/tactical/Ada.marina.WIM-Tactical-Spec.md',
          'services/ada.marina.wim/config/marina_wim_rules.yaml',
          'services/ada.marina.wim/CLAUDE.md',
          'services/wimMasterData.ts'
      ],
      rules: { // Simplified representation of marina_wim_rules.yaml
        max_loa: 90.0,
        speed_limit_knots: 3,
        critical_debt_amount_eur: 1000,
      },
      doctrine: `This service represents the tenant: West Istanbul Marina (WIM). It operates under the Tactical Agentic Coding (TAC) doctrine.`,
      masterData: wimMasterData, // Full wimMasterData
    },
    {
      id: 'dmaris_gocek',
      name: 'D-Marin Göcek',
      fullName: 'ADA.MARINA.DMARISGOCEK',
      network: 'dmarin.ada.network',
      node_address: 'ada.marina.dmarisgocek',
      status: 'ONLINE', // Ready for future integration
      api_endpoint: 'https://api.dmarina.com/gocek',
      mission: 'D-Marin Göcek operasyonlarını Ada ekosistemi üzerinden yönetmek.',
      contextSources: [],
      rules: {},
      doctrine: 'D-Marin Göcek operates under D-Marin Group protocols.',
      masterData: {},
    },
    {
      id: 'setur_kalamis',
      name: 'Setur Kalamış & Fenerbahçe Marina',
      fullName: 'ADA.MARINA.SETURKALAMIS',
      network: 'setur.ada.network',
      node_address: 'ada.marina.seturkalamis',
      status: 'ONLINE',
      api_endpoint: 'https://api.seturmarinas.com/kalamis',
      mission: 'Setur Kalamış operasyonlarını Ada ekosistemi üzerinden yönetmek.',
      contextSources: [],
      rules: {},
      doctrine: 'Setur Marinas Group protocols are followed.',
      masterData: {},
    },
    {
      id: 'setur_midilli',
      name: 'Setur Mytilene Marina',
      fullName: 'ADA.MARINA.SETURMIDILLI',
      network: 'setur.ada.network',
      node_address: 'ada.marina.seturmidilli',
      region: 'GR_AEGEAN', // Cross-border protocol active
      status: 'ONLINE',
      api_endpoint: 'https://api.seturmarinas.com/midilli',
      mission: 'Setur Midilli operasyonlarını Ada ekosistemi üzerinden yönetmek, cross-border senaryoları desteklemek.',
      contextSources: [],
      rules: {},
      doctrine: 'Setur Marinas Group protocols are followed, with Greek regulations.',
      masterData: {},
    },
    {
      id: 'ycm_monaco',
      name: 'Yacht Club de Monaco',
      fullName: 'ADA.MARINA.MONACOYACHTCLUB',
      network: 'ycm.ada.network',
      node_address: 'ada.marina.monacoyachtclub',
      tier: 'PRESTIGE_PARTNER',
      status: 'ONLINE',
      api_endpoint: 'https://api.ycm.mc',
      mission: 'Yacht Club de Monaco ile federasyon işbirliklerini yönetmek.',
      contextSources: [],
      rules: {},
      doctrine: 'YCM operates under prestigious club standards.',
      masterData: {},
    },
    {
      id: 'phisedelia',
      name: 'S/Y Phisedelia',
      fullName: 'ADA.SEA.PHISEDELIA',
      network: 'ada.sea.network',
      node_address: 'ada.sea.phisedelia',
      region: 'OPEN_SEA',
      status: 'ONLINE',
      api_endpoint: 'https://api.ada.sea/phisedelia', // Placeholder API endpoint
      mission: `Otonom yarış teknesi S/Y Phisedelia'nın açık deniz yarışlarında (Volvo Ocean Race / Ocean Globe Race) optimum performans, güvenlik ve kural uyumu ile ilerlemesini sağlamak.`,
      contextSources: [
          'docs/tactical/Ada.sea.Phisedelia-Tactical-Spec.md',
          'services/ada.sea.phisedelia/config/sea_phisedelia_rules.yaml',
          'services/ada.sea.phisedelia/CLAUDE.md',
          // No masterData currently for Phisedelia directly, can add later
      ],
      rules: { // Simplified representation of sea_phisedelia_rules.yaml
        max_speed_knots: 30.0,
        max_heel_angle_deg: 25.0,
        colregs_safe_distance_nm: 0.5,
        service_battery_critical_v: 23.0,
      },
      doctrine: `This service represents the tenant: S/Y Phisedelia (Autonomous Racing Yacht). It operates under the Tactical Agentic Coding (TAC) doctrine.`,
      masterData: { // Placeholder for Phisedelia specific master data
        vessel_id: 'PHI-V065',
        type: 'VO65 Racing Yacht',
        flag: 'MT',
        loa: 20.4,
        beam: 5.6,
        draft: 4.7,
        polar_version: 'V3.2',
        sail_inventory: ['Main', 'Jib1', 'Jib2', 'Code0', 'A2', 'A4'],
      },
      vesselType: 'VO65 Racing Yacht',
      flag: 'MT',
      operationalLimits: { // Specific from sea_phisedelia_rules.yaml
        max_speed_knots: 30.0,
        max_heel_angle_deg: 25.0,
        min_depth_m: 3.0,
        colregs_safe_distance_nm: 0.5,
      },
      racingRules: {
        osr_category: "Category 1",
        boundary_check_radius_m: 50.0,
      },
      systemThresholds: {
        service_battery_critical_v: 23.0,
        fuel_critical_pct: 15,
        bilge_high_water_level_cm: 10,
      },
      communicationProtocols: {
        vhf_emergency_channel: "16",
        vhf_race_channel: "77",
        satellite_link_active: true,
      },
      requiredDocumentsRace: [
        "Vessel Measurement Certificate",
        "Sail Inventory Certificate",
        "Safety Equipment Certificate",
        "World Sailing OSR Compliance",
        "Crew Medical Certificates",
      ],
      sensors: {
        nmea2000_active: true,
        ais_transponder_active: true,
        radar_active: true,
        camera_active: true,
      },
      autonomyLevels: {
        colregs_collision_avoidance: 'L3',
        sail_trim_optimization: 'L2',
        engine_start_stop: 'L3_CRITICAL_ONLY',
        route_selection: 'L1',
      },
    }
  ]
};

// This constant now dynamically pulls from the registry.
// For the current WIM application, we default to 'wim'.
export const TENANT_CONFIG: TenantConfig = FEDERATION_REGISTRY.peers.find(p => p.id === 'wim') || FEDERATION_REGISTRY.peers[0];
