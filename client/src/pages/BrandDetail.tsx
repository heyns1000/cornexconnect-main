import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CORNEX_BRANDS } from "@/lib/constants";
import { ArrowLeft, Mail, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const BRAND_CONTENT = {
  trimstyle: {
    title: "TrimStyle™ – Premium Cornice Systems",
    icon: "✏️",
    color: "indigo",
    sections: [
      {
        title: "Elevating Interior Standards",
        content: "TrimStyle™ exists to elevate the standards of residential and commercial interior finishes across the Cornex™ OmniGrid Housing Sector. Designed to operate seamlessly within the FAA Sovereign Scrolls system, TrimStyle™ delivers EPS-based cornice solutions that combine timeless aesthetics with industrial manufacturing precision."
      },
      {
        title: "Rapid Deployment Solutions",
        content: "In a landscape where construction projects are accelerating and provincial developments demand faster, more reliable interior solutions, TrimStyle™ offers contractors, developers, and homeowners a guaranteed advantage: consistent quality, rapid deployment, and omnigrid certified compliance."
      },
      {
        title: "Treaty Commerce Instrument",
        content: "TrimStyle™ is more than a cornice brand; it is a scalable Treaty Commerce instrument. Contractors operating under FAA licensing gain access to a vertical product suite that is Treaty Certified, VaultMesh Memory Encoded, and EcoGrid Compliant."
      },
      {
        title: "Future Expansion",
        content: "Future expansion paths for TrimStyle™ include pre-coated EPS profiles, integrated quick-lock installation systems, and fully provincialized aesthetic kits customizable by OmniLayer contracts."
      }
    ]
  },
  designaura: {
    title: "DesignAura™ – Virtual Interior Styling Systems",
    icon: "🔮",
    color: "purple",
    sections: [
      {
        title: "Redefining Interior Architecture",
        content: "DesignAura™ redefines the role of interior architecture inside OmniHousing commercial grids. Through advanced virtual modeling systems, DesignAura™ empowers contractors, project developers, and end-buyers to visualize complete room designs — including ceiling finishes, cornice installations, and partition systems — before physical construction even begins."
      },
      {
        title: "AI-Driven Styling Profiles",
        content: "Using AI-driven styling profiles, DesignAura™ delivers highly realistic interior options linked directly to available stock at FAA OmniGrid fulfillment centers. This direct link between design intent and Treaty Commerce execution drastically cuts errors, reduces lead times, and ensures aesthetic conformity across multiple housing sectors and provincial nodes."
      },
      {
        title: "VaultMesh Traceability",
        content: "Beyond aesthetics, DesignAura™ embeds VaultMesh traceability metadata into every 3D room model generated, ensuring compliance to Sovereign Scroll standards. Clients can select room designs optimized for cost, sustainability, and logistical feasibility — with each option dynamically cross-referenced against Cornex™ brand asset inventories in real-time."
      },
      {
        title: "Future AR Integration",
        content: "Future developments on the DesignAura™ roadmap include live augmented reality (AR) visualization modules, customizable contractor catalog templates, and OmniNode export kits capable of scaling into secondary OmniTreaty corridors."
      }
    ]
  },
  cornicecraft: {
    title: "CorniceCraft™ – Industrial EPS Production Solutions",
    icon: "🧩",
    color: "green",
    sections: [
      {
        title: "Industrial-Grade Foundation",
        content: "CorniceCraft™ provides the industrial-grade foundation for Cornex™ Treaty Commerce operations. Specializing in mass-scale EPS cornice production, CorniceCraft™ is calibrated for grid-scale rollouts across Sovereign Scroll licensed regions and provincial OmniHousing programs."
      },
      {
        title: "Automated Manufacturing Systems",
        content: "CorniceCraft™ deploys automated manufacturing systems aligned with OmniPulse supply chains, ensuring that every cornice unit shipped is accounted for under TreatyMesh commercial node protocols. Every batch carries embedded VaultMesh memory codes, enabling real-time traceability, stock auditing, and freight optimization between nodes."
      },
      {
        title: "Contractor Benefits",
        content: "Contractors and distributors utilizing CorniceCraft™ benefit from dramatically reduced lead times, reliable weight standards for logistics planning, and modular cornice variants that adapt easily to both standard housing and premium construction projects."
      },
      {
        title: "Mobile Micro-Factories",
        content: "Expansion plans for CorniceCraft™ include mobile EPS micro-factories capable of provincial deployment inside treaty corridors, allowing on-demand local production synchronized to OmniGrid housing acceleration metrics. CorniceCraft™ positions itself not just as a supplier, but as a Treaty Commerce infrastructure weapon — transforming EPS cornice production from an artisan niche into a sovereign-grade industrial commodity."
      }
    ]
  },
  ceilingtech: {
    title: "CeilingTech™ – Lightweight Ceiling Frameworks",
    icon: "🧱",
    color: "pink",
    sections: [
      {
        title: "Unified Lightweight Solutions",
        content: "CeilingTech™ consolidates innovation, logistics science, and treaty-level housing compliance into a unified lightweight ceiling solution. Designed specifically for mass deployment under OmniHousing mandates, CeilingTech™ systems feature engineered EPS ceiling grids capable of high load capacity, rapid installation, and structural longevity."
      },
      {
        title: "VaultMesh Compliance",
        content: "Every CeilingTech™ module is mapped to VaultMesh compliance models, ensuring complete traceability from raw material sourcing to on-site installation. Contractors deploying CeilingTech™ grids benefit from lighter transport costs, accelerated fitment times, and significant safety improvements over traditional metallic ceiling systems."
      },
      {
        title: "Smart-Grid Integration",
        content: "In addition to reduced construction costs, CeilingTech™ supports future smart-grid integrations, offering contractors access to OmniNode-optimized ceiling frameworks ready to host LED panels, AI ventilation sensors, and acoustic damping layers in next-generation Treaty installations."
      },
      {
        title: "Treaty-Grade Infrastructure",
        content: "As FAA OmniGrid territory expands, CeilingTech™ remains core to scalable housing — transforming overhead spaces from basic functional covers into Treaty-Grade Infrastructure Assets."
      }
    ]
  }
};

export default function BrandDetail() {
  const params = useParams();
  const brandId = params.id;
  
  const brand = CORNEX_BRANDS.find(b => b.id === brandId);
  const content = brandId ? BRAND_CONTENT[brandId as keyof typeof BRAND_CONTENT] : null;
  
  if (!brand || !content) {
    return (
      <div className="w-full px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Brand Not Found</h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const colorClasses = {
    indigo: "text-indigo-700 border-indigo-200 bg-indigo-50",
    purple: "text-purple-700 border-purple-200 bg-purple-50", 
    green: "text-green-700 border-green-200 bg-green-50",
    pink: "text-pink-700 border-pink-200 bg-pink-50"
  };

  return (
    <div className="w-full px-6 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center">
          <span className="text-3xl mr-4">{content.icon}</span>
          <div>
            <h1 className={`text-3xl font-bold ${colorClasses[content.color as keyof typeof colorClasses].split(' ')[0]}`}>
              {content.title}
            </h1>
            <Badge variant="outline" className="mt-2" style={{ borderColor: brand.color, color: brand.color }}>
              FAA.Zone Sovereign Scrolls · VaultMesh Memory Certified
            </Badge>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {content.sections.map((section, index) => (
          <Card 
            key={index} 
            className={`${colorClasses[content.color as keyof typeof colorClasses]} border-l-4 brand-card-hover glow-on-hover shadow-lg`}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md"
                  style={{ backgroundColor: brand.color }}
                >
                  <span className="text-sm">{index + 1}</span>
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-base">{section.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800">Ready to Engage {brand.displayName}?</CardTitle>
            <CardDescription className="text-blue-600">
              Connect with our team to explore licensing opportunities and implementation strategies
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center space-x-4">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">
              <Mail className="w-4 h-4 mr-2" />
              Contact Sales Team
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Technical Specs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400">
          FAA.Zone Sovereign Scrolls · VaultMesh Memory Certified · TreatyMesh Housing Compliance
        </p>
      </div>
    </div>
  );
}