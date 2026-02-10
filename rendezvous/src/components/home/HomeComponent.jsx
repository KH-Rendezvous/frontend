import React, { useState } from "react";
import HeaderComponent from "./HeaderComponent";
import { Link, useNavigate } from "react-router-dom"; // useNavigate는 여기서는 안 쓰지만 Link 로직 변경
import FooterComponent from "./FooterComponent";
import { axiosApi } from "../../api/axiosAPI";

const HomeComponent = () => {
  const [modal, setModal] = useState(false);

  const isLogin = !!localStorage.getItem("loginMember");

  // 문의 폼 상태 관리
  const [formData, setFormData] = useState({
    email: "",
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("문의 내용:", formData);
    try {
      const resp = await axiosApi.post("/main/support", formData);
      if (resp.status === 200) {
        alert("문의가 접수되었습니다. 입력하신 이메일로 답변을 보내드릴게요!");
      } else {
        alert("문의 접수 실패...");
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    }
    setModal(false);
    setFormData({ email: "", title: "", content: "" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent />
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModal(false)}
          ></div>

          <div className="relative bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-fadeInUp">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">고객 지원</h3>
                <p className="text-sm text-gray-500 mt-1">
                  궁금한 내용을 남겨주세요.
                </p>
              </div>
              <button
                onClick={() => setModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                  답변 받을 이메일
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                  문의 제목
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="제목을 입력해 주세요"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                  문의 내용
                </label>
                <textarea
                  required
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="5"
                  placeholder="상세한 내용을 적어주시면 빠른 확인이 가능합니다."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#EE4B6F] focus:ring-2 focus:ring-[#EE4B6F]/20 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#EE4B6F] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#d63a5c] transition-all shadow-lg shadow-[#EE4B6F]/20"
              >
                문의 보내기
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 md:px-10">
        <section className="flex flex-col-reverse lg:flex-row justify-between items-center py-16 lg:py-24 gap-10 lg:gap-20">
          <div className="flex flex-col gap-8 text-center lg:text-left items-center lg:items-start flex-1 animate-fadeInUp">
            <div className="space-y-2">
              <p className="text-3xl md:text-[50px] font-bold leading-tight text-gray-800">
                우리의 만남이 <br className="hidden md:block" />
                시작되는 곳,
              </p>
              <p className="text-4xl md:text-[60px] font-extrabold text-[#EE4B6F]">
                랑데뷰
              </p>
            </div>

            <p className="text-gray-500 text-lg md:text-xl">
              당신의 취향과 가치관이 통하는
              <br className="md:hidden" /> 운명의 상대를 찾아보세요.
            </p>

            <Link
              to={isLogin ? "/discovery" : "/signIn"}
              className="bg-[#EE4B6F] text-white w-full max-w-[280px] py-4 rounded-full font-bold text-xl 
              hover:bg-[#d63a5c] transition-all duration-300 shadow-lg hover:shadow-[#EE4B6F]/40 transform hover:-translate-y-1 text-center"
            >
              지금 시작하기
            </Link>
          </div>

          <div className="flex-1 w-full max-w-[500px] lg:max-w-none relative animate-float">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#EE4B6F]/5 rounded-full blur-3xl -z-10"></div>
            <img
              src="/people.png"
              alt="랑데뷰 메인 이미지"
              className="w-full h-auto object-cover rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </section>

        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">
              Why Rendezvous?
            </h2>
            <p className="text-gray-500 mt-3">
              랑데뷰만의 특별한 기능을 경험해보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#fff0f3] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#EE4B6F] transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-[#EE4B6F] group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                퍼펙트 매칭
              </h3>
              <p className="text-gray-500 leading-relaxed">
                성향과 관심사를 정밀 분석해
                <br />
                당신과 가장 잘 맞는
                <br />
                <span className="font-semibold text-[#EE4B6F]">소울메이트</span>
                를 연결해 드려요.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#fff0f3] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#EE4B6F] transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-[#EE4B6F] group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                AI 코칭 매니저
              </h3>
              <p className="text-gray-500 leading-relaxed">
                첫 마디가 어렵나요?
                <br />
                대화 주제 추천부터 연애 조언까지
                <br />
                <span className="font-semibold text-[#EE4B6F]">AI</span>가
                도와드릴게요.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#fff0f3] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#EE4B6F] transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-[#EE4B6F] group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                핫플레이스 추천
              </h3>
              <p className="text-gray-500 leading-relaxed">
                우리 어디서 만날까?
                <br />
                만남을 더 특별하게 만들어 줄<br />
                <span className="font-semibold text-[#EE4B6F]">
                  최적의 장소
                </span>
                를 추천해요.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-[40px] px-6 py-16 flex flex-col items-center justify-center gap-8 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#EE4B6F]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#EE4B6F]/5 rounded-full blur-3xl"></div>

            <div className="z-10 text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                운명 같은 만남, 지금 시작해볼까요?
              </h2>
              <p className="text-gray-500 text-lg">
                당신의 소중한 인연이 랑데뷰에서 기다리고 있습니다.
              </p>
            </div>

            <Link
              to={isLogin ? "/discovery" : "/signIn"}
              className="z-10 bg-[#EE4B6F] text-white px-10 py-4 rounded-full text-xl font-bold 
              hover:bg-[#d63a5c] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              내 인연 찾으러 가기
            </Link>
          </div>
        </section>
        <button
          onClick={() => setModal(true)}
          className="fixed bottom-8 right-8 z-50 group flex items-center gap-3 cursor-pointer"
        >
          <div className="w-16 h-16 bg-[#EE4B6F] text-white rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(238,75,111,0.4)] hover:scale-110 active:scale-95 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </div>
        </button>
      </main>
      <FooterComponent />
    </div>
  );
};

export default HomeComponent;
