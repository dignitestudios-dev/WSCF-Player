import Image from "next/image";
import LoginBackButton from "@/features/auth/components/login-back-button";

interface LoginShellProps {
  children: React.ReactNode;
  contentMaxWidth?: string;
  contentClassName?: string;
  showBack?: boolean;
  backHref?: string;
  hideLogo?: boolean;
  matchLeftPanelToContent?: boolean;
}

export default function LoginShell({
  children,
  contentMaxWidth = "max-w-[560px]",
  contentClassName,
  showBack = false,
  backHref,
  hideLogo = false,
  matchLeftPanelToContent = false,
}: LoginShellProps) {
  const leftImageClassName = matchLeftPanelToContent
    ? "relative min-h-[320px] flex-1 overflow-hidden rounded-[44px] bg-[#eaeaea]"
    : "relative h-[min(960px,calc(107vh-6rem))] overflow-hidden rounded-[44px] bg-[#eaeaea]";

  const leftColumnClassName = matchLeftPanelToContent
    ? "relative hidden w-full shrink-0 px-6 py-8 lg:flex lg:w-[682px] lg:flex-col lg:px-10 lg:py-12"
    : "relative hidden w-full shrink-0 px-6 py-8 lg:block lg:w-[682px] lg:px-10 lg:py-4";

  const rowClassName = matchLeftPanelToContent
    ? "relative mx-auto flex max-w-[1640px] flex-col lg:flex-row lg:items-stretch"
    : "relative mx-auto flex min-h-screen max-w-[1640px] flex-col lg:flex-row";
  return (
    <div className="relative min-h-screen bg-wscf-bg">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%)",
        }}
      />

      <div className={rowClassName}>
        <div className={leftColumnClassName}>
          <div className={leftImageClassName}>
            <Image
              src="/images/loginpage.png"
              alt="Chess players"
              fill
              priority
              className="object-cover"
              sizes="682px"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0) 66.32%, #FFFFFF 100%)",
              }}
            />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <Image
                src="/images/logo.png"
                alt="WSCF - Growing Young Minds for the Future"
                width={400}
                height={370}
                priority
              />
            </div>
          </div>
        </div>

        <div
          className={`relative flex flex-1 flex-col px-6 py-8 lg:px-16 lg:py-12 ${
            matchLeftPanelToContent ? "min-w-0" : "overflow-hidden"
          }`}
        >
          {showBack && (
            <div className="absolute left-6 top-8 z-20 lg:left-0 lg:top-12">
              <LoginBackButton href={backHref} />
            </div>
          )}

          {!matchLeftPanelToContent && (
            <div className="pointer-events-none absolute -right-12 bottom-0 z-0 hidden xl:block">
              <Image
                src="/images/loginbottom.png"
                alt=""
                width={400}
                height={400}
                className="rotate-[-20deg] object-contain opacity-90"
                aria-hidden="true"
              />
            </div>
          )}

          {!hideLogo && (
            <div className="relative z-10 mb-8 flex justify-center lg:mb-10">
              <Image
                src="/images/logo.png"
                alt="WSCF - Wisconsin Scholastic Chess Federation"
                width={197}
                height={100}
                className="h-[100px] w-auto object-contain"
                priority
              />
            </div>
          )}

          <div
            className={`relative z-10 mx-auto flex w-full ${contentMaxWidth} flex-col ${
              matchLeftPanelToContent ? "" : "flex-1"
            } ${
              contentClassName ??
              (hideLogo ? "justify-start pt-16 lg:pt-20" : "justify-center")
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
