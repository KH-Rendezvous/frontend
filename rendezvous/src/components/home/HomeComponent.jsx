import React from "react";
import HeaderComponent from "./HeaderComponent";
import { Link } from "react-router-dom";
import FooterComponent from "./FooterComponent";

const HomeComponent = () => {
  return (
    <>
      <HeaderComponent />

      <div className="container m-auto">
        <section className="flex justify-between items-center px-40 py-10 ">
          <div className="flex flex-col gap-10">
            <div>
              <p className="text-[50px]">우리의 만남이 시작되는 곳,</p>
              <p className="text-[50px] text-[#EE4B6F]">랑데뷰</p>
            </div>
            <Link
              to="/signIn"
              className="bg-[#EE4B6F] text-white w-3xs rounded-2xl font-bold hover:cursor-pointer hover:bg-[#d0123b] p-4
          w-full text-[20px] text-center"
            >
              시작하기
            </Link>
          </div>
          <div>
            <img
              src="/people.png"
              alt="사람들"
              className="max-w-[511px] rounded-2xl"
            />
          </div>
        </section>
        <section className="flex justify-center mt-[100px] gap-23">
          <div className="shadow max-w-[341px] h-80 rounded-2xl px-13 py-13">
            <p className="text-[25px] text-center font-bold">매칭</p>
            <p>
              성향과 관심사를 분석해 당신과 가장 잘 맞는 소울메이트를 연결해
              드려요.
            </p>
          </div>
          <div className="shadow max-w-[341px] h-80 rounded-2xl px-13 py-13">
            <p className="text-[25px] text-center font-bold">AI 코칭 매니저</p>
            <p>
              첫 마디가 어렵나요? 대화 주제 추천부터 연애 조언까지 AI가
              도와드릴게요.
            </p>
          </div>
          <div className="shadow max-w-[341px] h-80 rounded-2xl px-13 py-13">
            <p className="text-[25px] text-center font-bold">
              우리 어디서 만날까?
            </p>
            <p>분위기 좋은 최적의 장소를 추천해 드려요.</p>
          </div>
        </section>
        <section className="flex flex-col justify-center items-center border shadow mt-10 max-w-[1210px] m-auto rounded-2xl border-[#ddd] py-[50px] gap-8">
          <p className="text-[25px] text-center font-bold">
            운명 같은 만남, 시작해볼까요?
          </p>
          <p className="text-[15px] text-center text-[#ddd]">
            당신의 인연이 기다리고 있어요
          </p>
          <Link
            to="/signIn"
            className="bg-[#EE4B6F] text-white w-3xs p-4 rounded-2xl text-[20px] font-bold  hover:bg-[#d0123b]
          text-center hover:cursor-pointer"
          >
            내 인연 찾으러 가기
          </Link>
        </section>
      </div>
      <FooterComponent />
    </>
  );
};

export default HomeComponent;
