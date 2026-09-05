import { TopologyNode, TopologyEdge, Scenario, AgentInfo, ReasoningStep } from '../types';

export const INITIAL_TOPOLOGY_NODES: TopologyNode[] = [
  // Network Core
  {
    id: 'vpc-prod-01',
    name: 'vpc-prod-east-1',
    type: 'VPC',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:ec2:us-east-1:109283748291:vpc/vpc-018f921',
    status: 'healthy',
    x: 500,
    y: 60,
    pos3D: [0, 4.2, -4],
    tps: 45000,
    latencyMs: 1.2,
    cpuPercent: 24,
    dependencies: []
  },
  {
    id: 'subnet-07',
    name: 'subnet-07',
    type: 'Subnet',
    tier: 'Tier-0',
    region: 'us-east-1a',
    arn: 'arn:aws:ec2:us-east-1:109283748291:subnet/subnet-07a82f',
    status: 'healthy',
    x: 240,
    y: 180,
    pos3D: [-3.8, 1.2, 0.2],
    tps: 18200,
    latencyMs: 2.1,
    cpuPercent: 41,
    dependencies: ['vpc-prod-01']
  },
  {
    id: 'subnet-08',
    name: 'subnet-08',
    type: 'Subnet',
    tier: 'Tier-0',
    region: 'us-east-1b',
    arn: 'arn:aws:ec2:us-east-1:109283748291:subnet/subnet-08b91c',
    status: 'healthy',
    x: 500,
    y: 180,
    pos3D: [0, 1.6, -2],
    tps: 15400,
    latencyMs: 1.9,
    cpuPercent: 36,
    dependencies: ['vpc-prod-01']
  },
  {
    id: 'subnet-09',
    name: 'subnet-09',
    type: 'Subnet',
    tier: 'Tier-0',
    region: 'us-east-1c',
    arn: 'arn:aws:ec2:us-east-1:109283748291:subnet/subnet-09c34d',
    status: 'healthy',
    x: 760,
    y: 180,
    pos3D: [3.8, 1.2, 0.2],
    tps: 11400,
    latencyMs: 2.4,
    cpuPercent: 29,
    dependencies: ['vpc-prod-01']
  },

  // Ingress & Gateways
  {
    id: 'api-gw-prod-v2',
    name: 'api-gateway',
    type: 'API Gateway',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:apigateway:us-east-1::/restapis/agw-882194',
    status: 'healthy',
    x: 200,
    y: 310,
    pos3D: [-4.6, -0.4, 1.4],
    tps: 14200,
    latencyMs: 8.5,
    cpuPercent: 52,
    dependencies: ['subnet-07']
  },
  {
    id: 'nat-gw-prod-01',
    name: 'nat-gateway',
    type: 'Subnet',
    tier: 'Tier-0',
    region: 'us-east-1a',
    arn: 'arn:aws:ec2:us-east-1:109283748291:natgateway/nat-0294e1b',
    status: 'healthy',
    x: 350,
    y: 290,
    pos3D: [-2.2, -0.2, 0.6],
    tps: 8900,
    latencyMs: 3.1,
    cpuPercent: 44,
    dependencies: ['subnet-07']
  },

  // Compute & Microservices
  {
    id: 'checkout-order-processor',
    name: 'payment-service',
    type: 'Lambda',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:lambda:us-east-1:109283748291:function:checkout-order-processor',
    status: 'healthy',
    x: 160,
    y: 450,
    pos3D: [-3.8, -2.2, 2.0],
    tps: 6800,
    latencyMs: 42.0,
    cpuPercent: 68,
    dependencies: ['api-gw-prod-v2', 'subnet-07', 'PaymentGatewayExecRole']
  },
  {
    id: 'auth-token-authorizer',
    name: 'auth-service',
    type: 'Lambda',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:lambda:us-east-1:109283748291:function:auth-token-authorizer',
    status: 'healthy',
    x: 340,
    y: 430,
    pos3D: [-1.6, -1.8, 1.0],
    tps: 9400,
    latencyMs: 14.2,
    cpuPercent: 48,
    dependencies: ['api-gw-prod-v2', 'subnet-07', 'cache-cluster-session-m6g']
  },
  {
    id: 'fraud-detection-engine',
    name: 'fraud-engine',
    type: 'EKS Pods',
    tier: 'Tier-1',
    region: 'us-east-1',
    arn: 'arn:aws:eks:us-east-1:109283748291:pod/fraud-engine-x84',
    status: 'healthy',
    x: 480,
    y: 440,
    pos3D: [0.2, -1.4, -0.4],
    tps: 3400,
    latencyMs: 28.0,
    cpuPercent: 72,
    dependencies: ['checkout-order-processor', 'subnet-08']
  },
  {
    id: 'notification-emitter',
    name: 'notifications',
    type: 'Lambda',
    tier: 'Tier-2',
    region: 'us-east-1',
    arn: 'arn:aws:lambda:us-east-1:109283748291:function:notification-emitter',
    status: 'healthy',
    x: 640,
    y: 440,
    pos3D: [3.4, -1.2, -0.8],
    tps: 1800,
    latencyMs: 22.0,
    cpuPercent: 19,
    dependencies: ['eventbridge-bus-orders']
  },

  // Databases & Cache
  {
    id: 'aurora-cluster-pg-15',
    name: 'aurora-primary',
    type: 'Database',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:rds:us-east-1:109283748291:cluster:aurora-prod-pg-15',
    status: 'healthy',
    x: 320,
    y: 590,
    pos3D: [-0.6, -3.4, -1.2],
    tps: 12500,
    latencyMs: 4.8,
    cpuPercent: 55,
    dependencies: ['subnet-08', 'subnet-09', 'AuroraDataAPIPolicy']
  },
  {
    id: 'cache-cluster-session-m6g',
    name: 'redis-cluster',
    type: 'Redis ElastiCache',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:elasticache:us-east-1:109283748291:cluster:session-cache-01',
    status: 'healthy',
    x: 180,
    y: 570,
    pos3D: [-5.0, -1.6, 2.4],
    tps: 22000,
    latencyMs: 0.8,
    cpuPercent: 38,
    dependencies: ['subnet-07']
  },
  {
    id: 'dynamodb-idempotency-keys',
    name: 'dynamodb-keys',
    type: 'Database',
    tier: 'Tier-1',
    region: 'us-east-1',
    arn: 'arn:aws:dynamodb:us-east-1:109283748291:table/idempotency-tokens',
    status: 'healthy',
    x: 520,
    y: 580,
    pos3D: [1.8, -3.2, 0.4],
    tps: 8400,
    latencyMs: 2.2,
    cpuPercent: 31,
    dependencies: ['checkout-order-processor']
  },

  // Queues & Messaging
  {
    id: 'sqs-high-priority-transactions',
    name: 'transaction-queue',
    type: 'Queue',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:sqs:us-east-1:109283748291:sqs-high-priority-transactions.fifo',
    status: 'healthy',
    x: 700,
    y: 570,
    pos3D: [3.6, -2.8, 1.0],
    tps: 5100,
    latencyMs: 12.0,
    cpuPercent: 26,
    dependencies: ['checkout-order-processor']
  },
  {
    id: 'eventbridge-bus-orders',
    name: 'event-bus',
    type: 'Queue',
    tier: 'Tier-1',
    region: 'us-east-1',
    arn: 'arn:aws:events:us-east-1:109283748291:event-bus/prod-orders',
    status: 'healthy',
    x: 820,
    y: 440,
    pos3D: [5.0, -1.0, -0.2],
    tps: 4200,
    latencyMs: 15.0,
    cpuPercent: 22,
    dependencies: ['checkout-order-processor']
  },

  // IAM & Security
  {
    id: 'PaymentGatewayExecRole',
    name: 'iam-payment-role',
    type: 'IAM Roles',
    tier: 'Tier-0',
    region: 'global',
    arn: 'arn:aws:iam::109283748291:role/PaymentGatewayExecRole',
    status: 'healthy',
    x: 100,
    y: 360,
    pos3D: [-5.8, 0.2, 2.6],
    tps: 7100,
    latencyMs: 1.1,
    cpuPercent: 12,
    dependencies: []
  },
  {
    id: 'AuroraDataAPIPolicy',
    name: 'iam-db-policy',
    type: 'IAM Roles',
    tier: 'Tier-1',
    region: 'global',
    arn: 'arn:aws:iam::109283748291:policy/AuroraDataAPIPolicy',
    status: 'healthy',
    x: 420,
    y: 690,
    pos3D: [0.8, -4.6, -1.4],
    tps: 9800,
    latencyMs: 1.0,
    cpuPercent: 8,
    dependencies: []
  },

  // Observability & Telemetry
  {
    id: 'datadog-agent-daemonset',
    name: 'telemetry-agent',
    type: 'Monitoring',
    tier: 'Tier-1',
    region: 'us-east-1',
    arn: 'arn:aws:ecs:us-east-1:109283748291:daemon/datadog-agent-v7',
    status: 'healthy',
    x: 880,
    y: 310,
    pos3D: [5.4, 2.2, 1.2],
    tps: 6200,
    latencyMs: 5.0,
    cpuPercent: 18,
    dependencies: ['subnet-07', 'subnet-08', 'subnet-09']
  },
  {
    id: 'pagerduty-sev1-router',
    name: 'incident-router',
    type: 'Monitoring',
    tier: 'Tier-0',
    region: 'global',
    arn: 'arn:aws:sns:us-east-1:109283748291:pagerduty-sev1-router',
    status: 'healthy',
    x: 860,
    y: 620,
    pos3D: [5.6, -3.6, 1.6],
    tps: 120,
    latencyMs: 35.0,
    cpuPercent: 5,
    dependencies: ['datadog-agent-daemonset']
  }
];

export const TOPOLOGY_EDGES: TopologyEdge[] = [
  // VPC -> Subnets
  { id: 'e1', source: 'vpc-prod-01', target: 'subnet-07', protocol: 'VPC Peering', label: '10.0.1.0/24' },
  { id: 'e2', source: 'vpc-prod-01', target: 'subnet-08', protocol: 'VPC Peering', label: '10.0.2.0/24' },
  { id: 'e3', source: 'vpc-prod-01', target: 'subnet-09', protocol: 'VPC Peering', label: '10.0.3.0/24' },

  // Subnet-07 dependencies
  { id: 'e4', source: 'subnet-07', target: 'api-gw-prod-v2', protocol: 'HTTPS', label: 'TLS v1.3' },
  { id: 'e5', source: 'subnet-07', target: 'nat-gw-prod-01', protocol: 'TCP', label: 'Egress Route' },
  { id: 'e6', source: 'subnet-07', target: 'cache-cluster-session-m6g', protocol: 'TCP', label: 'Port 6379' },

  // Ingress to Lambdas
  { id: 'e7', source: 'api-gw-prod-v2', target: 'checkout-order-processor', protocol: 'HTTPS', label: 'POST /v2/orders' },
  { id: 'e8', source: 'api-gw-prod-v2', target: 'auth-token-authorizer', protocol: 'HTTPS', label: 'JWT Authorizer' },

  // Auth & Cache
  { id: 'e9', source: 'auth-token-authorizer', target: 'cache-cluster-session-m6g', protocol: 'TCP', label: 'Session Lookup' },

  // Compute to DB
  { id: 'e10', source: 'checkout-order-processor', target: 'aurora-cluster-pg-15', protocol: 'TCP', label: 'Port 5432' },
  { id: 'e11', source: 'checkout-order-processor', target: 'dynamodb-idempotency-keys', protocol: 'HTTPS', label: 'Lock Mutex' },
  { id: 'e12', source: 'checkout-order-processor', target: 'sqs-high-priority-transactions', protocol: 'HTTPS', label: 'Enqueue FIFO' },
  { id: 'e13', source: 'checkout-order-processor', target: 'fraud-detection-engine', protocol: 'gRPC', label: 'Risk Scoring' },
  { id: 'e14', source: 'checkout-order-processor', target: 'eventbridge-bus-orders', protocol: 'HTTPS', label: 'Publish Event' },

  // Event to Notification
  { id: 'e15', source: 'eventbridge-bus-orders', target: 'notification-emitter', protocol: 'HTTPS', label: 'Event Trigger' },

  // IAM Role attachments
  { id: 'e16', source: 'PaymentGatewayExecRole', target: 'checkout-order-processor', protocol: 'IAM Assume', label: 'AssumeRole' },
  { id: 'e17', source: 'AuroraDataAPIPolicy', target: 'aurora-cluster-pg-15', protocol: 'IAM Assume', label: 'Enforce IAM DB' },

  // Monitoring
  { id: 'e18', source: 'subnet-07', target: 'datadog-agent-daemonset', protocol: 'TCP', label: 'Telemetry Stream' },
  { id: 'e19', source: 'datadog-agent-daemonset', target: 'pagerduty-sev1-router', protocol: 'HTTPS', label: 'Alert Trigger' }
];

export const SPECIALIST_AGENTS: AgentInfo[] = [
  {
    id: 'dependency-agent',
    name: 'Dependency Engine',
    role: 'DAG Deep Crawler',
    description: 'Traces synchronous & asynchronous graph bindings, VPC cross-peering, and transitive callers.',
    status: 'idle',
    findingsCount: 0,
    confidence: 99,
    iconName: 'Network'
  },
  {
    id: 'topology-agent',
    name: 'Topology Engine',
    role: 'Network & Mesh Auditor',
    description: 'Inspects CIDR allocation, AZ redundancy, routing tables, and gateway egress availability.',
    status: 'idle',
    findingsCount: 0,
    confidence: 98,
    iconName: 'Compass'
  },
  {
    id: 'security-agent',
    name: 'Security Sentinel',
    role: 'IAM & Boundary Sentinel',
    description: 'Evaluates zero-trust boundaries, IAM role escalation, KMS key access, and VPC endpoints.',
    status: 'idle',
    findingsCount: 0,
    confidence: 97,
    iconName: 'ShieldAlert'
  },
  {
    id: 'impact-agent',
    name: 'Impact Modeler',
    role: 'Blast Radius & Loss Estimator',
    description: 'Models traffic drop, cascading queue backpressure, P99 latency degradation, and financial loss.',
    status: 'idle',
    findingsCount: 0,
    confidence: 98,
    iconName: 'TrendingDown'
  },
  {
    id: 'policy-agent',
    name: 'Policy Verifier',
    role: 'Rego & Compliance Verifier',
    description: 'Executes OPA rules, SOC2 CC6.1, PCI-DSS 3.4, and internal zero-downtime architecture constraints.',
    status: 'idle',
    findingsCount: 0,
    confidence: 100,
    iconName: 'FileCheck'
  },
  {
    id: 'decision-agent',
    name: 'Consensus Core',
    role: 'Autonomous Consensus Engine',
    description: 'Synthesizes telemetry into definitive binary verdict with audit proof.',
    status: 'idle',
    findingsCount: 0,
    confidence: 99,
    iconName: 'Cpu'
  }
];

export const DEMO_SCENARIOS: Scenario[] = [
  {
    id: 'delete-subnet-07',
    command: 'Delete subnet-07',
    targetResourceId: 'subnet-07',
    title: 'Decommissioning Production DMZ Subnet (us-east-1a)',
    category: 'Network',
    riskLevel: 'CRITICAL',
    verdict: 'BLOCK',
    verdictSubtitle: 'Destructive deletion severs physical ingress in us-east-1a, dropping 14,200 active payment requests.',
    blastRadiusScore: 9.4,
    directlyAffectedCount: 7,
    indirectlyAffectedCount: 11,
    criticalDependency: 'Payment Service (checkout-order-processor)',
    revenueAtRiskPerMin: 48500,
    impactedTps: 14200,
    directImpactNodeIds: [
      'subnet-07',
      'api-gw-prod-v2',
      'nat-gw-prod-01',
      'cache-cluster-session-m6g',
      'checkout-order-processor',
      'auth-token-authorizer',
      'datadog-agent-daemonset'
    ],
    indirectImpactNodeIds: [
      'fraud-detection-engine',
      'aurora-cluster-pg-15',
      'dynamodb-idempotency-keys',
      'sqs-high-priority-transactions',
      'eventbridge-bus-orders',
      'notification-emitter',
      'pagerduty-sev1-router',
      'vpc-prod-01',
      'subnet-08',
      'subnet-09',
      'PaymentGatewayExecRole'
    ],
    policyViolations: [
      {
        id: 'POL-PCI-01',
        rule: 'pci_dss_cde_high_availability',
        framework: 'PCI-DSS',
        description: 'PCI Cardholder Data Environment must maintain uninterrupted multi-AZ survivability during production deployments.',
        severity: 'CRITICAL'
      }
    ],
    terraformDiff: `- resource "aws_subnet" "subnet_07" {
-   id                = "subnet-07a82f"
-   vpc_id            = aws_vpc.vpc_prod_01.id
-   cidr_block        = "10.0.1.0/24"
-   availability_zone = "us-east-1a"
- }`,
    safeRemediationTerraform: `# SENTINEL AI AUTO-GENERATED ZERO-DOWNTIME PATCH
# Step 1: Pre-drain traffic and associate Ingress with Subnet-08 (us-east-1b)
resource "aws_route_table_association" "ingress_failover" {
  subnet_id      = aws_subnet.subnet_08.id
  route_table_id = aws_route_table.prod_dmz.id
}

# Step 2: Enable ElastiCache automatic multi-AZ failover
resource "aws_elasticache_replication_group" "session_cache" {
  multi_az_enabled           = true
  automatic_failover_enabled = true
}`
  },

  {
    id: 'modify-rds-security-group',
    command: 'Modify RDS aurora security group',
    targetResourceId: 'aurora-cluster-pg-15',
    title: 'Restrict Aurora Ingress CIDR from Private App Subnets',
    category: 'Database',
    riskLevel: 'HIGH',
    verdict: 'REVIEW',
    verdictSubtitle: 'Revoking port 5432 ingress abruptly isolates 4 core microservices from connection pools.',
    blastRadiusScore: 6.8,
    directlyAffectedCount: 4,
    indirectlyAffectedCount: 6,
    criticalDependency: 'Aurora PostgreSQL Primary Pool',
    revenueAtRiskPerMin: 18200,
    impactedTps: 8600,
    directImpactNodeIds: ['aurora-cluster-pg-15', 'checkout-order-processor', 'AuroraDataAPIPolicy', 'fraud-detection-engine'],
    indirectImpactNodeIds: ['sqs-high-priority-transactions', 'eventbridge-bus-orders', 'pagerduty-sev1-router'],
    policyViolations: [],
    terraformDiff: `- resource "aws_security_group_rule" "allow_app_pg" { ... }`,
    safeRemediationTerraform: `# Step 1: Dual-bind security group rule to prevent instant disconnection`
  },

  {
    id: 'scale-down-staging-worker',
    command: 'Scale down staging worker pool',
    targetResourceId: 'notification-emitter',
    title: 'Autoscaling Group Minimum Size Adjustment in Staging',
    category: 'Compute',
    riskLevel: 'LOW',
    verdict: 'APPROVE',
    verdictSubtitle: 'Change meets all blast radius safety thresholds. Zero production impact.',
    blastRadiusScore: 1.2,
    directlyAffectedCount: 1,
    indirectlyAffectedCount: 0,
    criticalDependency: 'None (Staging)',
    revenueAtRiskPerMin: 0,
    impactedTps: 0,
    directImpactNodeIds: ['notification-emitter'],
    indirectImpactNodeIds: [],
    policyViolations: [],
    terraformDiff: `~ resource "aws_autoscaling_group" "staging_worker" { ... }`,
    safeRemediationTerraform: `# No remediation required. Verified safe.`
  }
];

export const SIMULATION_REASONING_STEPS: Record<string, ReasoningStep[]> = {
  'delete-subnet-07': [
    {
      id: 'step-1',
      agent: 'Dependency Engine',
      timestamp: '00:00.650',
      finding: 'Direct ENI Dependency Detected on Subnet-07',
      evidence: 'Found 7 active Elastic Network Interfaces (ENIs) bound to subnet-07a82f. Primary ingress api-gw-prod-v2 uses VPC link routing through this subnet.',
      affectedResourceIds: ['subnet-07', 'api-gw-prod-v2'],
      confidence: 99,
      severity: 'critical'
    }
  ]
};
