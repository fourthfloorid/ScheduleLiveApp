import { useState } from 'react';
import svgPaths from "./svg-btwbtegx6j";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSignupClick: () => void;
  isLoading: boolean;
}

function Tetx() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal gap-[8px] items-center relative shrink-0 text-center text-nowrap whitespace-pre" data-name="Tetx">
      <p className="leading-[32px] relative shrink-0 text-[24px] text-neutral-950" style={{ fontVariationSettings: "'wdth' 100" }}>
        Welcome Back
      </p>
      <p className="leading-[20px] relative shrink-0 text-[#4a5565] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Sign in to continue to Schedule
      </p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <Tetx />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Label">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Username
      </p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[15.989px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_57)" id="Icon">
          <path d={svgPaths.p126e4a00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
          <path d={svgPaths.p37f05600} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
        </g>
        <defs>
          <clipPath id="clip0_1_57">
            <rect fill="white" height="15.9887" width="15.9887" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#f3f3f5] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[16px] relative w-full">
          <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
            <Icon />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] flex-1 bg-transparent border-none outline-none text-[#1f2937] text-[16px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[5.993px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <Container1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Label">
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Password
      </p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[15.989px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_53)" id="Icon">
          <path d={svgPaths.p34907a80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
          <path d={svgPaths.p17f0aa30} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
        </g>
        <defs>
          <clipPath id="clip0_1_53">
            <rect fill="white" height="15.9887" width="15.9887" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[15.989px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 11">
            <path d={svgPaths.pc4a4400} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d={svgPaths.p2d1db600} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative">
        <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#2a6ef0] text-[14px] text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Forgot Password?
        </p>
      </div>
    </div>
  );
}

function Form({ onSubmit, onSignupClick, isLoading }: { onSubmit: (email: string, password: string) => void; onSignupClick: () => void; isLoading: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials when component mounts
  useState(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save or remove credentials based on remember me checkbox
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedPassword', password);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
    
    onSubmit(email, password);
  };

  const handleRememberMeChange = () => {
    const newValue = !rememberMe;
    setRememberMe(newValue);
    
    // If unchecking, remove saved credentials immediately
    if (!newValue) {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Form">
      <div className="content-stretch flex flex-col gap-[5.993px] items-start relative shrink-0 w-full">
        <Label />
        <div className="bg-[#f3f3f5] relative rounded-[8px] shrink-0 w-full">
          <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex items-center justify-between px-[12px] py-[16px] relative w-full">
              <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
                <Icon />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] flex-1 bg-transparent border-none outline-none text-[#1f2937] text-[16px]"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="content-stretch flex flex-col gap-[5.993px] items-start relative shrink-0 w-full">
        <Label1 />
        <div className="bg-[#f3f3f5] relative rounded-[8px] shrink-0 w-full">
          <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex items-center justify-between px-[12px] py-[16px] relative w-full">
              <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 flex-1">
                <Icon1 />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="font-['Roboto:Regular',sans-serif] font-normal leading-[normal] flex-1 bg-transparent border-none outline-none text-[#1f2937] text-[16px]"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="content-stretch flex flex-col items-start relative shrink-0 size-[15.989px]"
              >
                <Icon2 />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative shrink-0 w-full" data-name="Container">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between relative w-full">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.985px] h-[19.99px] items-center relative w-[115.203px]">
              <button
                type="button"
                onClick={handleRememberMeChange}
                className="bg-clip-padding border-0 border-[transparent] border-solid relative size-[15.989px] cursor-pointer touch-manipulation"
              >
                <div className="size-full">
                  <div className={`bg-[#f5f5f5] relative rounded-[4px] size-full transition-colors ${rememberMe ? 'bg-[#2a6ef0]' : ''}`}>
                    <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[4px]" />
                    {rememberMe && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={handleRememberMeChange}
                className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-[19.99px] items-center relative w-[91.229px] cursor-pointer"
              >
                <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[12px] text-[#6b7280] text-left whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Remember me
                </p>
              </button>
            </div>
            <Button1 />
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#2a6ef0] h-[52px] relative rounded-[14px] shrink-0 w-full hover:bg-[#1e5dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex h-[52px] items-center justify-center px-[134px] py-[11px] relative w-full">
            <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </p>
          </div>
        </div>
      </button>
      
      <div className="w-full text-center">
        <button
          type="button"
          onClick={onSignupClick}
          className="text-[#2a6ef0] hover:underline"
        >
          Don&apos;t have an account? Sign up
        </button>
      </div>
    </form>
  );
}

function Container7({ onLogin, onSignupClick, isLoading }: { onLogin: (email: string, password: string) => void; onSignupClick: () => void; isLoading: boolean }) {
  return (
    <div className="bg-white relative rounded-[24px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[24px] relative w-full">
          <Form onSubmit={onLogin} onSignupClick={onSignupClick} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

function Container8({ onLogin, onSignupClick, isLoading }: { onLogin: (email: string, password: string) => void; onSignupClick: () => void; isLoading: boolean }) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-start left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[362px]" data-name="Container">
      <Container />
      <Container7 onLogin={onLogin} onSignupClick={onSignupClick} isLoading={isLoading} />
    </div>
  );
}

export default function Login({ onLogin, onSignupClick, isLoading }: LoginProps) {
  return (
    <div className="bg-white relative size-full" data-name="Login">
      <Container8 onLogin={onLogin} onSignupClick={onSignupClick} isLoading={isLoading} />
    </div>
  );
}