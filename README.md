# Sentinel AI – Infrastructure Blast Radius Agent
> **"Before you change production, know what will break."**
> AI-Powered Change-Safety & Blast-Radius Engine for Cloud Infrastructure.

Built for National Hackathon — Competing for **Best UI / UX & Engineering Architecture**.

---

## ⚡ Overview

**Sentinel AI** intercepts proposed cloud changes (Terraform plans, OpenTofu specs, AWS CLI invocations, or natural language intent) and executes a deterministic, multi-agent blast radius simulation across the entire cloud topology before deployment.

### 🎨 Visual & Interaction Blend
- **AWS Console**: Enterprise trust, IAM perimeter validation, multi-AZ resilience.
- **Linear**: Fluid keyboard-first workflows, `Cmd+K` command palette, precision micro-interactions.
- **Datadog**: Live topology telemetry, RPS monitoring, P99 latency tracking, dependency graph meshes.
- **Vercel**: Ultra-dark aesthetic, modern geometric typography, atmospheric glow accents.
- **Stripe**: Visual storytelling, step-by-step evidence presentation, auto-generated migration patches.
- **Framer / GSAP**: Intentional, enterprise-grade physics without cartoonish bounce.
- **Figma**: Canvas pan/zoom controls, infinite topology exploration, node inspectors.

---

## 🏆 Signature Hackathon Demo ("What Breaks?")

1. **Hero Input**: Enter `Delete subnet-07` directly in the cinematic hero input (or click the preset button).
2. **Press Analyze**: The system transitions into the **5.4-second signature investigation sequence**:
   - **T+0.0s**: Change submitted (`aws_subnet.subnet_07 destroy`).
   - **T+0.8s**: **Supervisor Agent** activates and dispatches 6 specialist agents across 3 Availability Zones.
   - **T+1.6s**: The **6 Specialist Agents** launch in parallel with live streaming cards.
   - **T+1.6s – T+4.5s**: **Wavefront Blast Propagation** sweeps through the interactive topology graph:
     - Ground Zero (`subnet-07`) and 7 direct services (`api-gw-prod-v2`, `checkout-order-processor`, `nat-gw-prod-01`, `cache-cluster-session-m6g`) glow **CRITICAL RED**.
     - 11 indirect dependencies (`aurora-cluster-pg-15`, `sqs-high-priority-transactions`, `fraud-detection-engine`) glow **AMBER**.
     - Isolated services remain stable **ELECTRIC CYAN**.
   - **T+5.4s**: Dramatic **BLOCK CHANGE** verdict panel locks in with alert acoustics:
     - Risk Score: **CRITICAL (9.4 / 10)**
     - Directly Affected Services: **7**
     - Indirect Components: **11**
     - Critical Dependency: **Payment API (`checkout-order-processor` v2)**
     - Hard Policy Violations: **PCI-DSS 3.4.1 & SOC2 CC6.1 Multi-AZ Quorum**
     - Revenue At Risk: **$48,500 / min**
3. **Autonomous Auto-Fix**: Click **"Generate Safe Terraform Patch"** to view and simulate an autonomous traffic drain and multi-AZ failover that safely eliminates the outage before deletion!

---

## 🤖 The 6 Specialist AI Agents

1. **Dependency Agent** (`DAG Deep Crawler`): Traces physical ENIs, synchronous and asynchronous bindings, and transitive callers.
2. **Topology Agent** (`Network & Mesh Auditor`): Audits VPC CIDRs, subnets, route tables, and cross-AZ egress routes.
3. **Security Agent** (`IAM & Boundary Sentinel`): Validates STS tokens, IAM assume-role trust chains, and KMS perimeters.
4. **Impact Agent** (`Blast Radius & Loss Estimator`): Quantifies lost transactions (14,200 TPS), financial exposure ($48,500/min), and P99 latency spikes.
5. **Policy Agent** (`Rego & Compliance Verifier`): Enforces Open Policy Agent (OPA) rules, SOC2, and PCI-DSS compliance gates.
6. **Decision Agent** (`Autonomous Consensus Engine`): Synthesizes agent deductions into a cryptographic consensus verdict (`BLOCK`, `REVIEW`, or `APPROVE`).

---

## 🌐 Tech Stack

- **Framework**: React 19 + TypeScript + Vite 6
- **3D Engine**: Three.js + React Three Fiber + React Three Drei
- **Styling**: Tailwind CSS + Custom HUD Glassmorphism + Cyber Scanlines
- **Icons**: Lucide React
- **Audio**: Custom Web Audio API Synthesizer (Zero external audio assets required; toggleable mute)
- **Effects**: Canvas Confetti (for approved safe migrations)

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone <repo-url>
cd UI-Test

# Install dependencies
npm install

# Run Vite dev server
npm run dev

# Or build for production
npm run build
npm run preview
```

Open `http://localhost:5173` in your browser.
Press `Cmd + K` at any time to open the Command Palette.
