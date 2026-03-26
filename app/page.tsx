import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  const challengeCards = [
    {
      icon: "🎯",
      title: "Nutrition is hard",
      text: "Confusing advice makes it difficult to pick meals that are both safe and enjoyable."
    },
    {
      icon: "📋",
      title: "Planning takes time",
      text: "Balancing calories, macros, and blood sugar impact manually is exhausting."
    },
    {
      icon: "📱",
      title: "No clear system",
      text: "Most apps are either too generic or too strict to use every single day."
    }
  ];

  const benefitCards = [
    {
      icon: "🌿",
      title: "Smart Meal Plans",
      text: "Built from diabetes-friendly templates with practical ingredient swaps."
    },
    {
      icon: "🍲",
      title: "Real Recipes",
      text: "Meals are easy to cook and designed to be tasty, not clinical."
    },
    {
      icon: "🛡️",
      title: "Medical Backing",
      text: "Balanced nutrition logic with carbs, fiber, glycemic impact and scoring."
    }
  ];

  const sampleMeals = [
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80"
  ];

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="w-full border-b border-brand-border bg-white">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-4 md:px-8 xl:px-12">
          <div className="flex items-center justify-between">
            <img src="/images/logo-full.png" alt="JustThreeCrumbs logo" className="h-8 w-auto" />
            <Button href="/auth" variant="primary" className="px-5 py-2">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-4 pb-0 pt-6 md:px-8 md:pt-8 xl:px-12">
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
              <Button href="/auth">
                Generate My Meal Plan
              </Button>
              <p className="mt-3 text-[14px] leading-[1.6] text-brand-text/60">
                Designed for real dietary needs (starting with Type 2 Diabetes)
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[22px] bg-brand-bg shadow-sm ring-1 ring-black/5 sm:rounded-[28px]">
              <img src="/images/hero.png" alt="Meal plan preview" className="block h-auto w-full" />
            </div>

            <div className="mt-3 grid w-full grid-cols-1 gap-3 sm:absolute sm:inset-x-0 sm:bottom-[-18px] sm:z-10 sm:mt-0 sm:px-2 sm:grid-cols-3">
              <div className="group flex items-center gap-3 rounded-xl border border-brand-border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md sm:px-6 sm:py-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <p className="text-[14px] leading-[1.6] font-normal text-brand-text">Medical-Approved</p>
                </div>
              </div>

              <div className="group flex items-center gap-3 rounded-xl border border-brand-border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md sm:px-6 sm:py-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg">
                  <span className="text-[20px] leading-[1.6]">😍</span>
                </span>
                <div className="text-left">
                  <p className="text-[14px] leading-[1.6] font-normal text-brand-text">Delicious Recipes</p>
                </div>
              </div>

              <div className="group flex items-center gap-3 rounded-xl border border-brand-border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md sm:px-6 sm:py-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3H16L21 8V21H3V3H8Z" stroke="#066835" strokeWidth="2.1" strokeLinejoin="round" />
                    <path d="M8 3V8H13" stroke="#066835" strokeWidth="2.1" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="text-left">
                  <p className="text-[14px] leading-[1.6] font-normal text-brand-text">Easy Planning</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-14 space-y-14 pb-14 md:mt-20 md:space-y-20 md:pb-16">
          <section>
            <h2 className="text-center text-[24px] font-medium text-brand-text md:text-[30px]">
              Following a medical diet is harder than it should be.
            </h2>
            <p className="mx-auto mt-3 max-w-[560px] text-center text-[14px] text-brand-text/60">
              We simplify the process from target calories to practical meals.
            </p>
            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {challengeCards.map((card) => (
                <article key={card.title} className="rounded-xl border border-brand-border bg-white p-5">
                  <div className="text-[20px]">{card.icon}</div>
                  <h3 className="mt-2 text-[16px] font-medium text-brand-text">{card.title}</h3>
                  <p className="mt-1 text-[13px] leading-[1.6] text-brand-text/65">{card.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-center text-[24px] font-medium text-brand-text md:text-[30px]">
              JustThreeCrumbs makes it simple.
            </h2>
            <p className="mx-auto mt-3 max-w-[560px] text-center text-[14px] text-brand-text/60">
              You can create medically appropriate plans that still feel human.
            </p>
            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {benefitCards.map((card) => (
                <article key={card.title} className="rounded-xl border border-brand-border bg-white p-5">
                  <div className="text-[20px]">{card.icon}</div>
                  <h3 className="mt-2 text-[16px] font-medium text-brand-text">{card.title}</h3>
                  <p className="mt-1 text-[13px] leading-[1.6] text-brand-text/65">{card.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-center text-[24px] font-medium text-brand-text md:text-[30px]">How it works</h2>
            <div className="mx-auto mt-7 max-w-[780px] space-y-4">
              {[
                {
                  n: "1",
                  t: "Fill your profile",
                  d: "We collect your key health and dietary details to estimate personalized targets."
                },
                {
                  n: "2",
                  t: "Generate your plan",
                  d: "Our template engine builds balanced breakfasts, lunches, dinners, and snacks."
                },
                {
                  n: "3",
                  t: "Fine-tune and enjoy",
                  d: "Swap ingredients, remove items, and export recipes in a practical day-by-day format."
                }
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-3 rounded-xl border border-brand-border bg-white p-4">
                  <div className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-primary text-[13px] font-semibold text-white">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-medium text-brand-text">{step.t}</h3>
                    <p className="mt-1 text-[13px] leading-[1.6] text-brand-text/65">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-center text-[24px] font-medium text-brand-text md:text-[30px]">
              This is what your diet can look like
            </h2>
            <div className="mt-7 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
              {sampleMeals.map((imageUrl, index) => (
                <article key={imageUrl} className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
                  <img src={imageUrl} alt={`Meal ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-center text-[24px] font-medium text-brand-text md:text-[30px]">
              Built around real dietary needs
            </h2>
            <div className="mx-auto mt-7 grid max-w-[860px] gap-0 overflow-hidden rounded-xl border border-brand-border bg-white sm:grid-cols-2">
              {[
                {
                  title: "Evidence-based targets",
                  text: "Daily calories and macros are estimated from personal profile data."
                },
                {
                  title: "Ingredient flexibility",
                  text: "You can replace products while keeping recalculated nutrition in real time."
                },
                {
                  title: "Condition-specific nutrition",
                  text: "Plans adapt to different dietary and health contexts with transparent nutrition metrics."
                },
                {
                  title: "Practical everyday cooking",
                  text: "Recipes are designed for regular kitchens with familiar ingredients."
                }
              ].map((item, idx) => (
                <article
                  key={item.title}
                  className={`p-5 ${idx < 2 ? "border-b border-brand-border" : ""} ${idx % 2 === 0 ? "sm:border-r sm:border-brand-border" : ""}`}
                >
                  <h3 className="text-[16px] font-medium text-brand-text">{item.title}</h3>
                  <p className="mt-1 text-[13px] leading-[1.6] text-brand-text/65">{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <section className="bg-brand-primary py-10">
        <div className="mx-auto w-full max-w-[1120px] px-4 text-center md:px-8">
          <h2 className="text-[30px] font-medium text-white md:text-[40px]">
            Start eating better, without overthinking it.
          </h2>
          <p className="mt-2 text-[14px] text-white/85">Just one profile, one click, one focused plan.</p>
          <Button href="/auth" variant="secondary" className="mt-5 bg-white px-7 text-brand-primary">
            Create My Plan
          </Button>
        </div>
      </section>

      <footer className="bg-[#0A2B1C] py-5">
        <div className="mx-auto w-full max-w-[1120px] px-4 text-center text-[12px] text-white/75 md:px-8">
          © {new Date().getFullYear()} JustThreeCrumbs. Personalized nutrition planning.
        </div>
      </footer>
    </div>
  );
}
