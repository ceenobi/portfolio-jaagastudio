import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Resend } from "resend";
import { PageSection, PageWrapper } from "~/components/pageWrapper";
import ImageComponent from "~/components/imageComponent";

export function meta() {
  return [
    {
      title:
        "Contact Jaaga Studio — Let's Create Something Extraordinary Together",
    },
    {
      name: "description",
      content:
        "Get in touch with Jaaga Studio, a specialized VFX Designer in Lagos and 3D Motion Designer. Available for new business, collaborations, and high-end creative direction.",
    },
    {
      name: "keywords",
      content:
        "Vfx designer lagos, creative designer, 3d motion designer, contact VFX, hire motion designer",
    },
  ];
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const message = String(formData.get("message") || "");

  const brevoApiKey = process.env.BREVO_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f7; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
          .header { background-color: #0c0c0c; padding: 40px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
          .content { padding: 40px; }
          .field { margin-bottom: 24px; }
          .label { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #888; margin-bottom: 4px; }
          .value { font-size: 18px; font-weight: 500; color: #1a1a1a; }
          .message-box { background-color: #fafafa; border-radius: 12px; padding: 24px; border: 1px solid #eeeeee; font-size: 16px; color: #444; white-space: pre-wrap; }
          .footer { padding: 30px; text-align: center; border-top: 1px solid #f0f0f0; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Portfolio Inquiry</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Sender Name</span>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <span class="label">Email Address</span>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <span class="label">The Message</span>
              <div class="message-box">${message}</div>
            </div>
          </div>
          <div class="footer">
            All rights reserved — Ceenobi
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    // ALTERNATIVE 1: Brevo (Sendinblue) REST API
    if (brevoApiKey) {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: name, email: email },
          to: [{ email: "Petmastiffee@gmail.com", name: "Jaaga Studio" }],
          subject: `Work Inquiry from ${name}`,
          htmlContent: emailHtml,
        }),
      });

      if (!response.ok) {
        throw new Error("Brevo Delivery Failed");
      }
      return {
        success: true,
        message:
          "Message sent successfully. I'll get back to you as soon as possible.",
      };
    }

    // ALTERNATIVE 2: Resend SDK
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>", // Requires verified domain in prod
        to: "Petmastiffee@gmail.com",
        subject: `New Inquiry from ${name}`,
        html: emailHtml,
      });
      return {
        success: true,
        message: "Message securely routed via Resend.",
      };
    }

    // Fallback: Development Mode
    console.warn("No API Keys found. Form submission mocked.");
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network latency
    return {
      success: true,
      message: "Development Mode: Application submitted successfully.",
    };
  } catch (error) {
    console.error("Email Gateway Error:", error);
    return {
      success: false,
      message: "An error occurred while sending. Please try again.",
    };
  }
}

export default function Contact() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (actionData?.success) {
      formRef.current?.reset();
    }
  }, [actionData]);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth background transition (already in place)
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    ["#0a0a0a", "#121214", "#161216", "#0a0a0a"],
  );

  // Parallax Transforms for internal elements
  const yText = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -300]);

  // Section-level transitions (Apple-style Stacking)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

  const formY = useTransform(scrollYProgress, [0.1, 0.6], [400, 0]);
  const formOpacity = useTransform(scrollYProgress, [0.1, 0.9], [0.4, 1]);

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor: bgColor }}
      className="min-h-screen overflow-clip text-white selection:bg-SoftApricot selection:text-black py-4 transition-colors duration-700 ease-out flex flex-col w-full relative"
    >
      <PageWrapper>
        {/* Section 0: Hero */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-0"
        >
          <PageSection
            index={0}
            className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 px-4 md:px-8"
          >
            <div className="relative z-10 flex flex-col w-full h-full">
              {/* The Massive "contact" Text */}
              <motion.div
                style={{ y: yText }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-[28vw] sm:text-[26vw] md:text-[24vw] lg:text-[22vw] font-bold leading-[0.75] tracking-[-0.07em] lowercase text-white mix-blend-difference">
                  contact
                </h1>
              </motion.div>

              {/* Subtitle / CTA Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-12 md:mt-6 lg:mt-[-2vw] relative z-20 max-w-[90%] md:max-w-2xl lg:max-w-4xl pl-2 md:pl-4"
              >
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-medium tracking-tight text-white/90 leading-[1.05]">
                  Start a conversation about new business or media inquiries.
                </h2>
              </motion.div>
            </div>

            {/* Floating Element Overlap (Interactive) */}
            <motion.div
              style={{ y: yImage }}
              initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              whileHover={{ scale: 1.02, opacity: 0.85 }}
              transition={{
                delay: 0.5,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute right-[-10%] md:right-0 lg:right-[5%] top-[15%] md:top-[10%] lg:top-[5%] w-[65vw] md:w-[45vw] lg:w-[35vw] max-w-[500px] z-30 pointer-events-auto cursor-pointer drop-shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <div className="relative aspect-4/3 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black/50 group">
                <motion.div
                  whileHover={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-linear-to-tr from-white/5 to-white/20 backdrop-blur-md z-10 mix-blend-overlay"
                />
                <ImageComponent cellValue="https://res.cloudinary.com/ceenobi/image/upload/v1776177332/clientproject/havisClient/80e93e1bf36be47afb45bd818a6a2d74_tplv-tiktokx-cropcenter_1080_1080_ftbw5z.jpg" />
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-8 left-6 md:left-12 flex items-center gap-4 text-white/40 font-bold tracking-[0.3em] uppercase text-xs"
            >
              Scroll
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="w-px h-10 bg-linear-to-b from-white/40 to-transparent"
              />
            </motion.div>
          </PageSection>
        </motion.div>

        {/* Section 1: Contact Form Section */}
        <motion.div
          style={{ y: formY, opacity: formOpacity }}
          className="relative z-10"
        >
          <PageSection
            index={1}
            className="min-h-screen full flex items-center py-32 px-4 md:px-8 relative z-20"
          >
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {/* Left Column: Context */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 flex flex-col gap-8"
              >
                <h3 className="text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight text-white/95 leading-[1.1]">
                  Let's <br /> Talk.
                </h3>
                <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light max-w-md mt-4">
                  Whether you have a project in mind, a collaboration to
                  explore, or just want to say hi, my inbox is always open.
                </p>

                <div className="mt-12 space-y-8">
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-SoftApricot/70 mb-3">
                      Email
                    </p>
                    <a
                      href="mailto:petmastiffee@gmail.com"
                      className="text-xl md:text-2xl font-medium text-white/90 hover:text-SoftApricot transition-colors"
                      title="Email Jaaga Studios directly"
                    >
                      Petmastiffee@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-SoftApricot/70 mb-3">
                      Location
                    </p>
                    <p className="text-xl md:text-2xl font-medium text-white/90">
                      Lagos, Nigeria (NG)
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="lg:col-span-7 lg:pt-6"
              >
                <Form
                  ref={formRef}
                  method="post"
                  className="flex flex-col gap-14"
                >
                  {/* Form Feedback */}
                  {actionData && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`px-4 py-3 rounded-lg border flex items-center gap-3 ${
                        actionData.success
                          ? "bg-[#101010] border-green-500/20 text-green-400"
                          : "bg-[#101010] border-red-500/20 text-red-400"
                      }`}
                    >
                      {actionData.success ? (
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                      <p className="text-sm font-medium tracking-wide">
                        {actionData.message}
                      </p>
                    </motion.div>
                  )}

                  {/* Name Input */}
                  <div className="relative group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      aria-required="true"
                      aria-label="Your full name"
                      placeholder=" "
                      className="block w-full appearance-none bg-transparent border-b border-white/20 py-4 text-xl md:text-2xl text-white focus:outline-none focus:border-white peer transition-colors"
                    />
                    <label
                      htmlFor="name"
                      className="absolute top-4 left-0 text-xl md:text-2xl text-white/40 duration-300 transform -translate-y-8 scale-75 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-white/80 pointer-events-none"
                    >
                      Your Name
                    </label>
                  </div>

                  {/* Email Input */}
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      aria-required="true"
                      aria-label="Your email address"
                      placeholder=" "
                      className="block w-full appearance-none bg-transparent border-b border-white/20 py-4 text-xl md:text-2xl text-white focus:outline-none focus:border-white peer transition-colors"
                    />
                    <label
                      htmlFor="email"
                      className="absolute top-4 left-0 text-xl md:text-2xl text-white/40 duration-300 transform -translate-y-8 scale-75 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-white/80 pointer-events-none"
                    >
                      Email Address
                    </label>
                  </div>

                  {/* Message Input */}
                  <div className="relative group mt-4">
                    <textarea
                      id="message"
                      name="message"
                      required
                      aria-required="true"
                      aria-label="Describe your project"
                      placeholder=" "
                      rows={4}
                      className="block w-full appearance-none bg-transparent border-b border-white/20 py-4 text-xl md:text-2xl text-white focus:outline-none focus:border-white peer transition-colors resize-none"
                    ></textarea>
                    <label
                      htmlFor="message"
                      className="absolute top-4 left-0 text-xl md:text-2xl text-white/40 duration-300 transform -translate-y-8 scale-75 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-white/80 pointer-events-none"
                    >
                      Tell me about your project...
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label={
                      isSubmitting
                        ? "Sending your message"
                        : "Send your message to Charles"
                    }
                    className="mt-4 group relative self-start overflow-hidden rounded-full bg-white px-12 py-5 transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="relative z-10 flex items-center gap-3 text-sm md:text-base font-bold text-black uppercase tracking-widest">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </span>
                    <div className="absolute inset-0 z-0 bg-SoftApricot transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  </button>
                </Form>
              </motion.div>
            </div>
          </PageSection>
        </motion.div>
      </PageWrapper>
    </motion.div>
  );
}
