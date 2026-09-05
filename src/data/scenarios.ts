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
    tps: 45000,
    latencyMs: 1.2,
    cpuPercent: 24,
    dependencies: []
  },
  {
    id: 'subnet-07',
    name: 'subnet-07 (DMZ-East-1a)',
    type: 'Subnet',
    tier: 'Tier-0',
    region: 'us-east-1a',
    arn: 'arn:aws:ec2:us-east-1:109283748291:subnet/subnet-07a82f',
    status: 'healthy',
    x: 240,
    y: 180,
    tps: 18200,
    latencyMs: 2.1,
    cpuPercent: 41,
    dependencies: ['vpc-prod-01']
  },
  {
    id: 'subnet-08',
    name: 'subnet-08 (App-East-1b)',
    type: 'Subnet',
    tier: 'Tier-0',
    region: 'us-east-1b',
    arn: 'arn:aws:ec2:us-east-1:109283748291:subnet/subnet-08b91c',
    status: 'healthy',
    x: 500,
    y: 180,
    tps: 15400,
    latencyMs: 1.9,
    cpuPercent: 36,
    dependencies: ['vpc-prod-01']
  },
  {
    id: 'subnet-09',
    name: 'subnet-09 (Data-East-1c)',
    type: 'Subnet',
    tier: 'Tier-0',
    region: 'us-east-1c',
    arn: 'arn:aws:ec2:us-east-1:109283748291:subnet/subnet-09c34d',
    status: 'healthy',
    x: 760,
    y: 180,
    tps: 11400,
    latencyMs: 2.4,
    cpuPercent: 29,
    dependencies: ['vpc-prod-01']
  },

  // Ingress & Gateways
  {
    id: 'api-gw-prod-v2',
    name: 'api-gw-prod-v2',
    type: 'API Gateway',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:apigateway:us-east-1::/restapis/agw-882194',
    status: 'healthy',
    x: 200,
    y: 310,
    tps: 14200,
    latencyMs: 8.5,
    cpuPercent: 52,
    dependencies: ['subnet-07']
  },
  {
    id: 'nat-gw-prod-01',
    name: 'nat-gw-prod-01',
    type: 'Subnet',
    tier: 'Tier-0',
    region: 'us-east-1a',
    arn: 'arn:aws:ec2:us-east-1:109283748291:natgateway/nat-0294e1b',
    status: 'healthy',
    x: 350,
    y: 290,
    tps: 8900,
    latencyMs: 3.1,
    cpuPercent: 44,
    dependencies: ['subnet-07']
  },

  // Microservices & Compute
  {
    id: 'checkout-order-processor',
    name: 'checkout-order-processor',
    type: 'Lambda',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:lambda:us-east-1:109283748291:function:checkout-order-processor',
    status: 'healthy',
    x: 160,
    y: 450,
    tps: 6800,
    latencyMs: 42.0,
    cpuPercent: 68,
    dependencies: ['api-gw-prod-v2', 'subnet-07', 'PaymentGatewayExecRole']
  },
  {
    id: 'auth-token-authorizer',
    name: 'auth-token-authorizer',
    type: 'Lambda',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:lambda:us-east-1:109283748291:function:auth-token-authorizer',
    status: 'healthy',
    x: 340,
    y: 430,
    tps: 9400,
    latencyMs: 14.2,
    cpuPercent: 48,
    dependencies: ['api-gw-prod-v2', 'subnet-07', 'cache-cluster-session-m6g']
  },
  {
    id: 'fraud-detection-engine',
    name: 'fraud-detection-engine',
    type: 'EKS Pods',
    tier: 'Tier-1',
    region: 'us-east-1',
    arn: 'arn:aws:eks:us-east-1:109283748291:pod/fraud-engine-x84',
    status: 'healthy',
    x: 480,
    y: 440,
    tps: 3400,
    latencyMs: 28.0,
    cpuPercent: 72,
    dependencies: ['checkout-order-processor', 'subnet-08']
  },
  {
    id: 'notification-emitter',
    name: 'notification-emitter',
    type: 'Lambda',
    tier: 'Tier-2',
    region: 'us-east-1',
    arn: 'arn:aws:lambda:us-east-1:109283748291:function:notification-emitter',
    status: 'healthy',
    x: 640,
    y: 440,
    tps: 1800,
    latencyMs: 22.0,
    cpuPercent: 19,
    dependencies: ['eventbridge-bus-orders']
  },

  // Databases & Cache
  {
    id: 'aurora-cluster-pg-15',
    name: 'aurora-cluster-pg-15',
    type: 'Database',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:rds:us-east-1:109283748291:cluster:aurora-prod-pg-15',
    status: 'healthy',
    x: 320,
    y: 590,
    tps: 12500,
    latencyMs: 4.8,
    cpuPercent: 55,
    dependencies: ['subnet-08', 'subnet-09', 'AuroraDataAPIPolicy']
  },
  {
    id: 'cache-cluster-session-m6g',
    name: 'cache-cluster-session-m6g',
    type: 'Redis ElastiCache',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:elasticache:us-east-1:109283748291:cluster:session-cache-01',
    status: 'healthy',
    x: 180,
    y: 570,
    tps: 22000,
    latencyMs: 0.8,
    cpuPercent: 38,
    dependencies: ['subnet-07']
  },
  {
    id: 'dynamodb-idempotency-keys',
    name: 'dynamodb-idempotency-keys',
    type: 'Database',
    tier: 'Tier-1',
    region: 'us-east-1',
    arn: 'arn:aws:dynamodb:us-east-1:109283748291:table/idempotency-tokens',
    status: 'healthy',
    x: 520,
    y: 580,
    tps: 8400,
    latencyMs: 2.2,
    cpuPercent: 31,
    dependencies: ['checkout-order-processor']
  },

  // Queues & Messaging
  {
    id: 'sqs-high-priority-transactions',
    name: 'sqs-high-priority-tx',
    type: 'Queue',
    tier: 'Tier-0',
    region: 'us-east-1',
    arn: 'arn:aws:sqs:us-east-1:109283748291:sqs-high-priority-transactions.fifo',
    status: 'healthy',
    x: 700,
    y: 570,
    tps: 5100,
    latencyMs: 12.0,
    cpuPercent: 26,
    dependencies: ['checkout-order-processor']
  },
  {
    id: 'eventbridge-bus-orders',
    name: 'eventbridge-bus-orders',
    type: 'Queue',
    tier: 'Tier-1',
    region: 'us-east-1',
    arn: 'arn:aws:events:us-east-1:109283748291:event-bus/prod-orders',
    status: 'healthy',
    x: 820,
    y: 440,
    tps: 4200,
    latencyMs: 15.0,
    cpuPercent: 22,
    dependencies: ['checkout-order-processor']
  },

  // Security & IAM
  {
    id: 'PaymentGatewayExecRole',
    name: 'PaymentGatewayExecRole',
    type: 'IAM Roles',
    tier: 'Tier-0',
    region: 'global',
    arn: 'arn:aws:iam::109283748291:role/PaymentGatewayExecRole',
    status: 'healthy',
    x: 100,
    y: 360,
    tps: 7100,
    latencyMs: 1.1,
    cpuPercent: 12,
    dependencies: []
  },
  {
    id: 'AuroraDataAPIPolicy',
    name: 'AuroraDataAPIPolicy',
    type: 'IAM Roles',
    tier: 'Tier-1',
    region: 'global',
    arn: 'arn:aws:iam::109283748291:policy/AuroraDataAPIPolicy',
    status: 'healthy',
    x: 420,
    y: 690,
    tps: 9800,
    latencyMs: 1.0,
    cpuPercent: 8,
    dependencies: []
  },

  // Observability & Monitoring
  {
    id: 'datadog-agent-daemonset',
    name: 'datadog-agent-daemonset',
    type: 'Monitoring',
    tier: 'Tier-1',
    region: 'us-east-1',
    arn: 'arn:aws:ecs:us-east-1:109283748291:daemon/datadog-agent-v7',
    status: 'healthy',
    x: 880,
    y: 310,
    tps: 6200,
    latencyMs: 5.0,
    cpuPercent: 18,
    dependencies: ['subnet-07', 'subnet-08', 'subnet-09']
  },
  {
    id: 'pagerduty-sev1-router',
    name: 'pagerduty-sev1-router',
    type: 'Monitoring',
    tier: 'Tier-0',
    region: 'global',
    arn: 'arn:aws:sns:us-east-1:109283748291:pagerduty-sev1-router',
    status: 'healthy',
    x: 860,
    y: 620,
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
  { id: 'e10', source: 'checkout-order-processor', target: 'aurora-cluster-pg-15', protocol: 'TCP', label: 'Port 5432 (Pool)' },
  { id: 'e11', source: 'checkout-order-processor', target: 'dynamodb-idempotency-keys', protocol: 'HTTPS', label: 'Lock Mutex' },
  { id: 'e12', source: 'checkout-order-processor', target: 'sqs-high-priority-transactions', protocol: 'HTTPS', label: 'Enqueue FIFO' },
  { id: 'e13', source: 'checkout-order-processor', target: 'fraud-detection-engine', protocol: 'gRPC', label: 'Risk Scoring' },
  { id: 'e14', source: 'checkout-order-processor', target: 'eventbridge-bus-orders', protocol: 'HTTPS', label: 'Publish OrderEvent' },

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
    name: 'Dependency Agent',
    role: 'DAG Deep Crawler',
    description: 'Traces synchronous & asynchronous graph bindings, VPC cross-peering, and transitive callers.',
    status: 'idle',
    findingsCount: 0,
    confidence: 99,
    iconName: 'Network'
  },
  {
    id: 'topology-agent',
    name: 'Topology Agent',
    role: 'Network & Mesh Auditor',
    description: 'Inspects CIDR allocation, AZ redundancy, routing tables, and gateway egress availability.',
    status: 'idle',
    findingsCount: 0,
    confidence: 98,
    iconName: 'Compass'
  },
  {
    id: 'security-agent',
    name: 'Security Agent',
    role: 'IAM & Boundary Sentinel',
    description: 'Evaluates zero-trust boundaries, IAM role escalation, KMS key access, and VPC endpoints.',
    status: 'idle',
    findingsCount: 0,
    confidence: 97,
    iconName: 'ShieldAlert'
  },
  {
    id: 'impact-agent',
    name: 'Impact Agent',
    role: 'Blast Radius & Loss Estimator',
    description: 'Models traffic drop, cascading queue backpressure, P99 latency degradation, and financial loss.',
    status: 'idle',
    findingsCount: 0,
    confidence: 98,
    iconName: 'TrendingDown'
  },
  {
    id: 'policy-agent',
    name: 'Policy Agent',
    role: 'Rego & Compliance Verifier',
    description: 'Executes OPA rules, SOC2 CC6.1, PCI-DSS 3.4, and internal zero-downtime architecture constraints.',
    status: 'idle',
    findingsCount: 0,
    confidence: 100,
    iconName: 'FileCheck'
  },
  {
    id: 'decision-agent',
    name: 'Decision Agent',
    role: 'Autonomous Consensus Engine',
    description: 'Synthesizes telemetry into definitive binary verdict (APPROVE / REVIEW / BLOCK) with audit proof.',
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
    verdictSubtitle: 'Destructive deletion creates catastrophic Tier-0 payment outage across us-east-1a.',
    blastRadiusScore: 9.4,
    directlyAffectedCount: 7,
    indirectlyAffectedCount: 11,
    criticalDependency: 'Payment API (checkout-order-processor v2)',
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
      },
      {
        id: 'POL-SOC2-44',
        rule: 'soc2_tier0_redundancy_quorum',
        framework: 'SOC2',
        description: 'Tier-0 Payment processing gateway requires quorum failover routing prior to physical network teardown.',
        severity: 'HIGH'
      }
    ],
    terraformDiff: `- resource "aws_subnet" "subnet_07" {
-   id                = "subnet-07a82f"
-   vpc_id            = aws_vpc.vpc_prod_01.id
-   cidr_block        = "10.0.1.0/24"
-   availability_zone = "us-east-1a"
-   tags = {
-     Environment = "production"
-     Tier        = "Tier-0-DMZ"
-   }
- }
# SENTINEL AI DETECTION:
# 7 Active ENIs currently attached.
# 14,200 active connections in flight.
# Deleting will trigger immediate 502 Bad Gateway cascade.`,
    safeRemediationTerraform: `# SENTINEL AI AUTO-GENERATED SAFE MIGRATION PATCH
# Step 1: Drain active ENIs and re-route Ingress to Subnet-08 (us-east-1b)
resource "aws_route_table_association" "ingress_failover" {
  subnet_id      = aws_subnet.subnet_08.id
  route_table_id = aws_route_table.prod_dmz.id
}

# Step 2: Migrate ElastiCache Redis replication group to multi-AZ cluster
resource "aws_elasticache_replication_group" "session_cache" {
  multi_az_enabled           = true
  automatic_failover_enabled = true
  preferred_cache_cluster_azs = ["us-east-1b", "us-east-1c"]
}`
  },

  {
    id: 'modify-rds-security-group',
    command: 'Modify RDS aurora-cluster-pg-15 Security Group (Revoke Port 5432)',
    targetResourceId: 'aurora-cluster-pg-15',
    title: 'Restrict Aurora Ingress CIDR from Private App Subnets',
    category: 'Database',
    riskLevel: 'HIGH',
    verdict: 'REVIEW',
    verdictSubtitle: 'Revoking ingress terminates connection pools for 4 core backend processing microservices.',
    blastRadiusScore: 6.8,
    directlyAffectedCount: 4,
    indirectlyAffectedCount: 6,
    criticalDependency: 'Aurora PostgreSQL Primary Pool',
    revenueAtRiskPerMin: 18200,
    impactedTps: 8600,
    directImpactNodeIds: ['aurora-cluster-pg-15', 'checkout-order-processor', 'AuroraDataAPIPolicy', 'fraud-detection-engine'],
    indirectImpactNodeIds: ['sqs-high-priority-transactions', 'eventbridge-bus-orders', 'pagerduty-sev1-router', 'datadog-agent-daemonset', 'api-gw-prod-v2', 'dynamodb-idempotency-keys'],
    policyViolations: [
      {
        id: 'POL-CIS-09',
        rule: 'cis_db_connection_lease_grace',
        framework: 'CIS-AWS',
        description: 'Database ingress rule modifications must implement graceful TCP drain periods to prevent data in-flight corruption.',
        severity: 'HIGH'
      }
    ],
    terraformDiff: `- resource "aws_security_group_rule" "allow_app_pg" {
-   type        = "ingress"
-   from_port   = 5432
-   to_port     = 5432
-   protocol    = "tcp"
-   cidr_blocks = ["10.0.2.0/24"]
- }`,
    safeRemediationTerraform: `# SENTINEL AI PATCH: Graceful Migration Security Group
resource "aws_security_group_rule" "allow_app_pg_dual_mode" {
  type        = "ingress"
  from_port   = 5432
  to_port     = 5432
  protocol    = "tcp"
  source_security_group_id = aws_security_group.app_lambda_sg.id
}`
  },

  {
    id: 'scale-down-staging-worker',
    command: 'Scale down worker-pool-spot in staging-us-west-2 (min: 2 -> 1)',
    targetResourceId: 'notification-emitter',
    title: 'Autoscaling Group Minimum Size Adjustment in Staging',
    category: 'Compute',
    riskLevel: 'LOW',
    verdict: 'APPROVE',
    verdictSubtitle: 'Change meets all blast radius safety thresholds. Zero production impact.',
    blastRadiusScore: 1.2,
    directlyAffectedCount: 1,
    indirectlyAffectedCount: 0,
    criticalDependency: 'None (Non-production worker pool)',
    revenueAtRiskPerMin: 0,
    impactedTps: 0,
    directImpactNodeIds: ['notification-emitter'],
    indirectImpactNodeIds: [],
    policyViolations: [],
    terraformDiff: `~ resource "aws_autoscaling_group" "staging_worker" {
-   min_size         = 2
+   min_size         = 1
    desired_capacity = 1
  }`,
    safeRemediationTerraform: `# No remediation required. Change is verified safe by Sentinel Policy Agent.`
  }
];

export const SIMULATION_REASONING_STEPS: Record<string, ReasoningStep[]> = {
  'delete-subnet-07': [
    {
      id: 'step-1',
      agent: 'Dependency Agent',
      timestamp: '00:00.650',
      finding: 'Direct ENI Dependency Detected on Subnet-07',
      evidence: 'Found 7 active Elastic Network Interfaces (ENIs) bound to subnet-07a82f. Primary ingress api-gw-prod-v2 uses VPC link routing through this subnet.',
      affectedResourceIds: ['subnet-07', 'api-gw-prod-v2'],
      confidence: 99,
      severity: 'critical'
    },
    {
      id: 'step-2',
      agent: 'Topology Agent',
      timestamp: '00:01.420',
      finding: 'Single Point of Failure (SPOF) in AZ us-east-1a Ingress Route',
      evidence: 'Subnet-07 hosts the sole NAT Gateway (nat-0294e1b) servicing private App subnet-08 egress. Deletion collapses internet egress for worker Lambdas.',
      affectedResourceIds: ['nat-gw-prod-01', 'subnet-08'],
      confidence: 98,
      severity: 'critical'
    },
    {
      id: 'step-3',
      agent: 'Impact Agent',
      timestamp: '00:02.180',
      finding: 'Payment Processing Cascade & $48,500/min Revenue Hazard',
      evidence: 'checkout-order-processor (handling 6,800 TPS) will encounter immediate TCP connection timeouts when cache-cluster-session-m6g in subnet-07 becomes unreachable.',
      affectedResourceIds: ['checkout-order-processor', 'cache-cluster-session-m6g'],
      confidence: 98,
      severity: 'critical'
    },
    {
      id: 'step-4',
      agent: 'Security Agent',
      timestamp: '00:02.940',
      finding: 'Orphaned IAM Execution Context & Token Leakage Risk',
      evidence: 'PaymentGatewayExecRole assumes STS tokens with active sessions bound to subnet-07 IP CIDR. Forcibly terminating network drops graceful revocation handshake.',
      affectedResourceIds: ['PaymentGatewayExecRole'],
      confidence: 96,
      severity: 'warning'
    },
    {
      id: 'step-5',
      agent: 'Policy Agent',
      timestamp: '00:03.650',
      finding: 'Violation: PCI-DSS 3.4.1 & SOC2 CC6.1 Multi-AZ Mandate',
      evidence: 'Rego policy check rule "pci_dss_cde_high_availability" failed with exit code 1. Production CDE boundary must retain at least 2 active AZ pathways.',
      affectedResourceIds: ['subnet-07', 'vpc-prod-01'],
      confidence: 100,
      severity: 'critical'
    },
    {
      id: 'step-6',
      agent: 'Decision Agent',
      timestamp: '00:04.310',
      finding: 'Consensus Reached: Unconditional BLOCK ENFORCED',
      evidence: 'Autonomous consensus from 5 specialist agents confirms Tier-0 failure probability of 99.4%. Blast radius exceeds allowable tolerance by 840%.',
      affectedResourceIds: ['subnet-07', 'checkout-order-processor', 'api-gw-prod-v2'],
      confidence: 99,
      severity: 'critical'
    }
  ]
};
