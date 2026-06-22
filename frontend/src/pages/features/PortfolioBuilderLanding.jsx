import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/ui/Footer';
import Seo from '../../components/Seo';

import PortfolioBuilderHero from '../../components/landing/PortfolioBuilderHero';
import FeatureShowcase from '../../components/landing/FeatureShowcase';
import FeatureVideoSection from '../../components/landing/FeatureVideoSection';
import FeatureHowItWorks from '../../components/landing/FeatureHowItWorks';
import FeatureTestimonials from '../../components/landing/FeatureTestimonials';
import FeatureCTA from '../../components/landing/FeatureCTA';
import { FEATURES_BY_SLUG } from '../../data/featuresConfig';

export default function PortfolioBuilderLanding() {
  const { user } = useAuth();
  const config = FEATURES_BY_SLUG['portfolio-builder'];

  const primaryCtaText = user ? config.primaryAction.label : config.hero.primaryCta.text;
  const primaryCtaLink = user ? config.primaryAction.to : config.hero.primaryCta.to;
  const ctaSectionText = user ? config.primaryAction.label : config.cta.ctaText;
  const ctaSectionLink = user ? config.primaryAction.to : config.cta.ctaTo;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Seo {...config.seo} />
      <Navbar />

      <main className="flex-1">
        {/* New interactive dot-grid hero (overrides FeatureLandingPage's hero) */}
        <PortfolioBuilderHero
          badgeText="150+ templates live"
          headlineBefore="Ship a stunning portfolio in"
          rotatingWords={['minutes', 'one click', 'a weekend', 'one coffee']}
          description={config.hero.description}
          primaryCta={{ text: primaryCtaText, to: primaryCtaLink }}
          secondaryCta={{ text: config.hero.secondaryCta.text, href: config.hero.secondaryCta.href }}
          templateGalleryHref={config.primaryAction.to}
        />

        <FeatureShowcase
          heading={config.showcase.heading}
          features={config.showcase.features}
        />

        <div id="demo">
          <FeatureVideoSection
            heading={config.video.heading}
            subheading={config.video.subheading}
            videoUrl={config.video.videoUrl}
            caption={config.video.caption}
          />
        </div>

        <FeatureHowItWorks
          heading={config.howItWorks.title}
          subheading="A simpler way to reach your goals."
          steps={config.howItWorks.steps}
        />

        <FeatureTestimonials
          heading={config.testimonials.heading}
          testimonials={config.testimonials.items}
        />

        <FeatureCTA
          heading={config.cta.headline}
          subheading={config.cta.subtext}
          primaryCtaText={ctaSectionText}
          primaryCtaLink={ctaSectionLink}
        />
      </main>

      <Footer />
    </div>
  );
}