import svgPaths from "./svg-ua9975pt31";

function Heading() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Heading 1">
      <div className="font-['Poppins:SemiBold',sans-serif] leading-[36px] not-italic relative shrink-0 text-[24px] text-gray-800 w-[380px]">
        <p className="mb-0">{`Welcome back, `}</p>
        <p>Host!</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Arial:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-gray-500 text-nowrap whitespace-pre">Manage your live streaming schedule</p>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Header">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Date() {
  return (
    <div className="bg-[#1c64f2] content-stretch flex flex-col items-center justify-center not-italic px-[10px] py-[12px] relative rounded-[24px] shrink-0 text-nowrap text-white whitespace-pre" data-name="date">
      <p className="font-['Poppins:Bold',sans-serif] leading-[18px] relative shrink-0 text-[12px] tracking-[-0.17px]">Sat</p>
      <p className="font-['Poppins:Medium',sans-serif] leading-[15px] relative shrink-0 text-[10px] tracking-[-0.165px]">6 Dec</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-px relative shrink-0 w-[6px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
        <g id="Frame 1"></g>
      </svg>
    </div>
  );
}

function Date1() {
  return (
    <div className="bg-neutral-100 content-stretch flex flex-col items-center justify-center px-[10px] py-[12px] relative rounded-[24px] shrink-0" data-name="date">
      <Frame />
      <p className="font-['Poppins:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#888888] text-[12px] text-nowrap tracking-[-0.17px] whitespace-pre">S</p>
      <p className="font-['Poppins:Regular',sans-serif] leading-[15px] not-italic relative shrink-0 text-[#888888] text-[10px] text-nowrap tracking-[-0.165px] whitespace-pre">7 Dec</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-px relative shrink-0 w-[6px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
        <g id="Frame 1"></g>
      </svg>
    </div>
  );
}

function Date2() {
  return (
    <div className="bg-neutral-100 content-stretch flex flex-col items-center justify-center px-[10px] py-[12px] relative rounded-[24px] shrink-0" data-name="date">
      <Frame1 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#888888] text-[12px] text-nowrap tracking-[-0.17px] whitespace-pre">M</p>
      <p className="font-['Poppins:Regular',sans-serif] leading-[15px] not-italic relative shrink-0 text-[#888888] text-[10px] text-nowrap tracking-[-0.165px] whitespace-pre">8 Dec</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-px relative shrink-0 w-[6px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
        <g id="Frame 1"></g>
      </svg>
    </div>
  );
}

function Date3() {
  return (
    <div className="bg-neutral-100 content-stretch flex flex-col items-center justify-center px-[10px] py-[12px] relative rounded-[24px] shrink-0" data-name="date">
      <Frame2 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#888888] text-[12px] text-nowrap tracking-[-0.17px] whitespace-pre">T</p>
      <p className="font-['Poppins:Regular',sans-serif] leading-[15px] not-italic relative shrink-0 text-[#888888] text-[10px] text-nowrap tracking-[-0.165px] whitespace-pre">9 Dec</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-px relative shrink-0 w-[6px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
        <g id="Frame 1"></g>
      </svg>
    </div>
  );
}

function Date4() {
  return (
    <div className="bg-neutral-100 content-stretch flex flex-col items-center justify-center px-[10px] py-[12px] relative rounded-[24px] shrink-0" data-name="date">
      <Frame3 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#888888] text-[12px] text-nowrap tracking-[-0.17px] whitespace-pre">W</p>
      <p className="font-['Poppins:Regular',sans-serif] leading-[15px] not-italic relative shrink-0 text-[#888888] text-[10px] text-nowrap tracking-[-0.165px] whitespace-pre">10 Dec</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-px relative shrink-0 w-[6px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
        <g id="Frame 1"></g>
      </svg>
    </div>
  );
}

function Date5() {
  return (
    <div className="bg-neutral-100 content-stretch flex flex-col items-center justify-center px-[10px] py-[12px] relative rounded-[24px] shrink-0" data-name="date">
      <Frame4 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#888888] text-[12px] text-nowrap tracking-[-0.17px] whitespace-pre">T</p>
      <p className="font-['Poppins:Regular',sans-serif] leading-[15px] not-italic relative shrink-0 text-[#888888] text-[10px] text-nowrap tracking-[-0.165px] whitespace-pre">11 Dec</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-px relative shrink-0 w-[6px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
        <g id="Frame 1"></g>
      </svg>
    </div>
  );
}

function Date6() {
  return (
    <div className="bg-neutral-100 content-stretch flex flex-col items-center justify-center px-[10px] py-[12px] relative rounded-[24px] shrink-0" data-name="date">
      <Frame5 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#888888] text-[12px] text-nowrap tracking-[-0.17px] whitespace-pre">F</p>
      <p className="font-['Poppins:Regular',sans-serif] leading-[15px] not-italic relative shrink-0 text-[#888888] text-[10px] text-nowrap tracking-[-0.165px] whitespace-pre">12 Dec</p>
    </div>
  );
}

function Week() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="week">
      <Date />
      <Date1 />
      <Date2 />
      <Date3 />
      <Date4 />
      <Date5 />
      <Date6 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #2A6EF0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #2A6EF0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #2A6EF0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #2A6EF0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-blue-100 content-stretch flex flex-col items-start pb-0 pt-[7.985px] px-[7.985px] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Paragraph">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-gray-500 text-nowrap whitespace-pre">This Week</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Paragraph">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-gray-800 text-nowrap whitespace-pre">0</p>
    </div>
  );
}

function Card() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.18px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[17px] relative w-full">
          <Container />
          <Paragraph1 />
          <Paragraph2 />
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_34_371)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #16A34A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #16A34A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
        </g>
        <defs>
          <clipPath id="clip0_34_371">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-green-100 content-stretch flex flex-col items-start pb-0 pt-[7.985px] px-[7.985px] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Paragraph">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-gray-500 text-nowrap whitespace-pre">Total</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Paragraph">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-gray-800 text-nowrap whitespace-pre">0</p>
    </div>
  );
}

function Card1() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.18px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[17px] relative w-full">
          <Container1 />
          <Paragraph3 />
          <Paragraph4 />
        </div>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Row">
      <Card />
      <Card1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_34_367)" id="Icon">
          <path d={svgPaths.pa590900} id="Vector" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
          <path d={svgPaths.p236b2f00} id="Vector_2" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
        </g>
        <defs>
          <clipPath id="clip0_34_367">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-amber-100 content-stretch flex flex-col items-start pb-0 pt-[7.985px] px-[7.985px] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Paragraph">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-gray-500 text-nowrap whitespace-pre">Rooms</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Paragraph">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-gray-800 text-nowrap whitespace-pre">1</p>
    </div>
  );
}

function Card2() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.18px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[17px] relative w-full">
          <Container2 />
          <Paragraph5 />
          <Paragraph6 />
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3155f180} id="Vector" stroke="var(--stroke-0, #EC4899)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
          <path d={svgPaths.pea6a680} id="Vector_2" stroke="var(--stroke-0, #EC4899)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-pink-100 content-stretch flex flex-col items-start pb-0 pt-[7.985px] px-[7.985px] relative rounded-[10px] shrink-0 size-[32px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Paragraph">
      <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-gray-500 text-nowrap whitespace-pre">Brands</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Paragraph">
      <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-gray-800 text-nowrap whitespace-pre">1</p>
    </div>
  );
}

function Card3() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border-[1.18px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[17px] relative w-full">
          <Container3 />
          <Paragraph7 />
          <Paragraph8 />
        </div>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Row">
      <Card2 />
      <Card3 />
    </div>
  );
}

function StaticDate() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-start relative shrink-0 w-full" data-name="Static Date">
      <Row />
      <Row1 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24.011px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-gray-800 text-nowrap top-[-1.82px] whitespace-pre">Quick Stats</p>
    </div>
  );
}

function Text() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative">
        <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-gray-500 w-[170px]">Average Daily Sessions</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="relative shrink-0 w-[32px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative w-[32px]">
        <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-gray-800 text-right w-full">0</p>
      </div>
    </div>
  );
}

function TotalHoursScheduled() {
  return (
    <div className="relative shrink-0 w-full" data-name="Total Hours Scheduled">
      <div aria-hidden="true" className="absolute border-[0px_0px_1.18px] border-gray-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[9.18px] pt-[8px] px-0 relative w-full">
          <Text />
          <Text1 />
        </div>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative">
        <p className="font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-gray-500 w-[170px]">Total Hours Scheduled</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="relative shrink-0 w-[32px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative w-[32px]">
        <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-gray-800 text-right w-full">0h</p>
      </div>
    </div>
  );
}

function TotalHoursScheduled1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Total Hours Scheduled">
      <div aria-hidden="true" className="absolute border-[0px_0px_1.18px] border-gray-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[9.18px] pt-[8px] px-0 relative w-full">
          <Text2 />
          <Text3 />
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[15.989px] h-[114.318px] items-start relative shrink-0 w-full" data-name="Container">
      <TotalHoursScheduled />
      <TotalHoursScheduled1 />
    </div>
  );
}

function QuickStats() {
  return (
    <div className="bg-white relative rounded-[14px] shrink-0 w-full" data-name="Quick Stats">
      <div aria-hidden="true" className="absolute border-[1.18px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start pb-[1.18px] pt-[17.169px] px-[17.169px] relative w-full">
          <Heading1 />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Calendar() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="calendar">
          <path d={svgPaths.p3ee34580} id="Vector" stroke="var(--stroke-0, #2A6EF0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #2A6EF0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M5.33333 1.33333V4" id="Vector_3" stroke="var(--stroke-0, #2A6EF0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #2A6EF0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Head() {
  return (
    <div className="content-stretch flex gap-[6px] items-end relative shrink-0 w-full" data-name="Head">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#161617] text-[15px] text-nowrap whitespace-pre">Upcoming Schedule to Join!</p>
      <Calendar />
    </div>
  );
}

function Time() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:Medium',sans-serif] h-[49px] items-center justify-between leading-[normal] not-italic relative shrink-0 text-center w-[47px]" data-name="Time">
      <p className="relative shrink-0 text-[#212525] text-[16px] w-full">13:00</p>
      <p className="relative shrink-0 text-[#bcc1cd] text-[14px] w-full">15:00</p>
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[#212525]" data-name="Title">
      <p className="font-['Poppins:SemiBold',sans-serif] min-w-full relative shrink-0 text-[16px] w-[min-content]">Taro</p>
      <p className="font-['Poppins:Medium',sans-serif] relative shrink-0 text-[12px] w-[158px]">Tiktop Shop</p>
    </div>
  );
}

function Ellipsis() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ellipsis">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ellipsis">
          <path d={svgPaths.p31354200} fill="var(--fill-0, #88889D)" id="Vector" />
          <path d={svgPaths.p22f6f0} fill="var(--fill-0, #88889D)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Head1() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Head">
      <Title />
      <Ellipsis />
    </div>
  );
}

function LocationPoint() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="location-point 3">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="location-point 3">
          <path d={svgPaths.p28c100} fill="var(--fill-0, #88889D)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Location() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Location">
      <LocationPoint />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#212525] text-[12px] text-nowrap whitespace-pre">Studio 1</p>
    </div>
  );
}

function Card4() {
  return (
    <div className="basis-0 bg-[#f6f6f5] grow h-[104px] min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Card">
      <div className="size-full">
        <div className="content-stretch flex flex-col h-[104px] items-start justify-between px-[8px] py-[12px] relative w-full">
          <Head1 />
          <Location />
        </div>
      </div>
    </div>
  );
}

function Schedule() {
  return (
    <div className="content-stretch flex gap-[34px] items-start relative shrink-0 w-full" data-name="Schedule">
      <Time />
      <Card4 />
    </div>
  );
}

function Time1() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:Medium',sans-serif] h-[49px] items-center justify-between leading-[normal] not-italic relative shrink-0 text-center w-[47px]" data-name="Time">
      <p className="relative shrink-0 text-[#212525] text-[16px] w-full">15:00</p>
      <p className="relative shrink-0 text-[#bcc1cd] text-[14px] w-full">17:00</p>
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[#212525]" data-name="Title">
      <p className="font-['Poppins:SemiBold',sans-serif] min-w-full relative shrink-0 text-[16px] w-[min-content]">Taro</p>
      <p className="font-['Poppins:Medium',sans-serif] relative shrink-0 text-[12px] w-[158px]">Tiktop Shop</p>
    </div>
  );
}

function Ellipsis1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ellipsis">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ellipsis">
          <path d={svgPaths.p31354200} fill="var(--fill-0, #88889D)" id="Vector" />
          <path d={svgPaths.p22f6f0} fill="var(--fill-0, #88889D)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Head2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Head">
      <Title1 />
      <Ellipsis1 />
    </div>
  );
}

function LocationPoint1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="location-point 3">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="location-point 3">
          <path d={svgPaths.p28c100} fill="var(--fill-0, #88889D)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Location1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Location">
      <LocationPoint1 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#212525] text-[12px] text-nowrap whitespace-pre">Studio 1</p>
    </div>
  );
}

function Card5() {
  return (
    <div className="basis-0 bg-[#f6f6f5] grow h-[104px] min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Card">
      <div className="size-full">
        <div className="content-stretch flex flex-col h-[104px] items-start justify-between px-[8px] py-[12px] relative w-full">
          <Head2 />
          <Location1 />
        </div>
      </div>
    </div>
  );
}

function Schedule1() {
  return (
    <div className="content-stretch flex gap-[34px] items-start relative shrink-0 w-full" data-name="Schedule">
      <Time1 />
      <Card5 />
    </div>
  );
}

function Time2() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:Medium',sans-serif] h-[49px] items-center justify-between leading-[normal] not-italic relative shrink-0 text-center w-[47px]" data-name="Time">
      <p className="relative shrink-0 text-[#212525] text-[16px] w-full">17:00</p>
      <p className="relative shrink-0 text-[#bcc1cd] text-[14px] w-full">19:00</p>
    </div>
  );
}

function Title2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[#212525]" data-name="Title">
      <p className="font-['Poppins:SemiBold',sans-serif] min-w-full relative shrink-0 text-[16px] w-[min-content]">Taro</p>
      <p className="font-['Poppins:Medium',sans-serif] relative shrink-0 text-[12px] w-[158px]">Tiktop Shop</p>
    </div>
  );
}

function Ellipsis2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ellipsis">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ellipsis">
          <path d={svgPaths.p31354200} fill="var(--fill-0, #88889D)" id="Vector" />
          <path d={svgPaths.p22f6f0} fill="var(--fill-0, #88889D)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Head3() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Head">
      <Title2 />
      <Ellipsis2 />
    </div>
  );
}

function LocationPoint2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="location-point 3">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="location-point 3">
          <path d={svgPaths.p28c100} fill="var(--fill-0, #88889D)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Location2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Location">
      <LocationPoint2 />
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#212525] text-[12px] text-nowrap whitespace-pre">Studio 1</p>
    </div>
  );
}

function Card6() {
  return (
    <div className="basis-0 bg-[#f6f6f5] grow h-[104px] min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Card">
      <div className="size-full">
        <div className="content-stretch flex flex-col h-[104px] items-start justify-between px-[8px] py-[12px] relative w-full">
          <Head3 />
          <Location2 />
        </div>
      </div>
    </div>
  );
}

function Schedule2() {
  return (
    <div className="content-stretch flex gap-[34px] items-start relative shrink-0 w-full" data-name="Schedule">
      <Time2 />
      <Card6 />
    </div>
  );
}

function Live() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Live">
      <Schedule />
      <Schedule1 />
      <Schedule2 />
    </div>
  );
}

function UpcomingEvents() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[378px] items-start relative shrink-0 w-full" data-name="Upcoming Events">
      <Head />
      <Live />
    </div>
  );
}

export default function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start px-0 py-[16px] relative size-full" data-name="Container">
      <Header />
      <Week />
      <StaticDate />
      <QuickStats />
      <UpcomingEvents />
    </div>
  );
}