import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header section: full-width, beige background, bottom border only */}
      <header className="w-full border-b border-brand-border bg-white">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-4 md:px-8 xl:px-12">
          <div className="flex items-center justify-between">
            <img src="/images/logo-full.png" alt="JustThreeCrumbs logo" className="h-8 w-auto" />
            <Button href="/onboarding" variant="primary" className="px-5 py-2">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-6 md:px-8 md:pt-8 xl:px-12">
        <section className="grid items-start gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
          <div>
            <h1 className="text-[34px] font-medium leading-[1.1] text-brand-text sm:text-[44px] lg:text-[56px]">
              <span>It's not just a diet.</span>
              <br />
              <span>It's food you'll</span>
              <br />
              <span className="text-brand-primary">actually enjoy.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-[1.6] text-brand-text/70">
              Personalized meal plans designed for real medical needs -- without sacrificing taste, variety,
              or simplicity.
            </p>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#F2E7D8] px-4 py-4 sm:gap-4 sm:px-6">
              <div className="mt-1 h-11 w-1 rounded-full bg-brand-accent" />
              <div>
                <p className="text-[15px] leading-[1.6] font-medium text-brand-text sm:text-[16px]">
                  Stop wondering what you can eat.
                </p>
                <p className="mt-1 text-[14px] leading-[1.6] font-normal text-brand-text/70 sm:text-[16px]">
                  Start enjoying food again -- safely and confidently.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Button href="/onboarding">
                Generate My Meal Plan
              </Button>
              <p className="mt-3 text-[14px] leading-[1.6] text-brand-text/60">
                Designed for real dietary needs (starting with Type 2 Diabetes)
              </p>
            </div>
          </div>

          {/* Right side: hero image with 3 cards overlayed at the bottom */}
          <div className="relative">
            <div className="overflow-hidden rounded-[22px] bg-brand-bg shadow-sm ring-1 ring-black/5 sm:rounded-[28px]">
              <img
                src="/images/hero.png"
                alt="Meal plan preview"
                className="block w-full h-auto"
              />
            </div>

            <div className="mt-3 grid w-full grid-cols-1 gap-3 sm:absolute sm:inset-x-0 sm:bottom-[-18px] sm:z-10 sm:mt-0 sm:px-2 sm:grid-cols-3">
              <div className="group flex items-center gap-3 rounded-xl border border-brand-border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md sm:px-6 sm:py-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="#066835"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="text-left">
                  <p className="text-[14px] leading-[1.6] font-normal text-brand-text">
                    Medical-Approved
                  </p>
                </div>
              </div>

              <div className="group flex items-center gap-3 rounded-xl border border-brand-border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md sm:px-6 sm:py-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg">
                  <span className="text-[20px] leading-[1.6]">😍</span>
                </span>
                <div className="text-left">
                  <p className="text-[14px] leading-[1.6] font-normal text-brand-text">
                    Delicious Recipes
                  </p>
                </div>
              </div>

              <div className="group flex items-center gap-3 rounded-xl border border-brand-border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md sm:px-6 sm:py-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 3H16L21 8V21H3V3H8Z"
                      stroke="#066835"
                      strokeWidth="2.1"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 3V8H13"
                      stroke="#066835"
                      strokeWidth="2.1"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="text-left">
                  <p className="text-[14px] leading-[1.6] font-normal text-brand-text">
                    Easy Planning
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
