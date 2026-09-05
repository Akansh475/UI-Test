export type NodeType = 
  | 'VPC' 
  | 'Subnet' 
  | 'API Gateway' 
  | 'Lambda' 
  | 'Database' 
  | 'Queue' 
  | 'Monitoring' 
  | 'IAM Roles' 
  | 'EKS Pods' 
  | 'Redis ElastiCache';

export type NodeTier = 'Tier-0' | 'Tier-1' | 'Tier-2';

export type NodeBlastState = 'normal' | 'target' | 'direct-impact' | 'indirect-impact' | 'safe';

export interface TopologyNode {
  id: string;
  name: string;
  type: NodeType;
  tier: NodeTier;
  region: string;
  arn: string;
  status: 'healthy' | 'degraded' | 'critical';
  x: number; // 0 to 1000 coordinate space
  y: number;
  blastState?: NodeBlastState;
  impactReason?: string;
  tps?: number;
  latencyMs?: number;
  cpuPercent?: number;
  dependencies: string[]; // ids this node calls or depends on
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  protocol?: 'HTTPS' | 'TCP' | 'VPC Peering' | 'IAM Assume' | 'gRPC';
  state?: 'normal' | 'severed' | 'degraded';
}

export type AgentStatus = 'idle' | 'scanning' | 'analyzing' | 'warning' | 'complete';

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  findingsCount: number;
  confidence: number;
  currentFinding?: string;
  iconName: string;
}

export interface ReasoningStep {
  id: string;
  agent: string;
  timestamp: string;
  finding: string;
  evidence: string;
  affectedResourceIds: string[];
  confidence: number;
  severity: 'info' | 'warning' | 'critical';
}

export interface PolicyViolation {
  id: string;
  rule: string;
  framework: 'SOC2' | 'PCI-DSS' | 'CIS-AWS' | 'Internal-FinServ';
  description: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
}

export type VerdictType = 'BLOCK' | 'REVIEW' | 'APPROVE';

export interface Scenario {
  id: string;
  command: string;
  targetResourceId: string;
  title: string;
  category: 'Network' | 'Database' | 'Compute' | 'IAM';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  verdict: VerdictType;
  verdictSubtitle: string;
  blastRadiusScore: number; // 0.0 - 10.0
  directlyAffectedCount: number;
  indirectlyAffectedCount: number;
  criticalDependency: string;
  revenueAtRiskPerMin: number;
  impactedTps: number;
  policyViolations: PolicyViolation[];
  terraformDiff: string;
  safeRemediationTerraform: string;
  directImpactNodeIds: string[];
  indirectImpactNodeIds: string[];
}
