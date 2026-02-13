import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function AiManager() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("회원");
  const textareaRef = useRef(null);

  const chatSessionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false);
  const MAX_LENGTH = 200;

  const initChat = async () => {
    try {
      // 1. 사용자 정보 가져오기 & 이름 다듬기
      let currentName = "회원";
      let targetGender = "F";

      const storedMember = localStorage.getItem("loginMember");

      if (storedMember) {
        const parsedMember = JSON.parse(storedMember);
        const fullName = parsedMember.name || parsedMember.nickname || "회원";

        // 사용자 이름 성 떼기
        if (fullName.length >= 3) {
          currentName = fullName.substring(1);
        } else {
          currentName = fullName;
        }

        if (parsedMember.targetGender && parsedMember.targetGender !== "A") {
          targetGender = parsedMember.targetGender;
        }
      }

      setUserName(currentName);

      // 2. 페르소나 설정 (★ TMI 삭제, 관심사 확장)
      const persona =
        targetGender === "F"
          ? {
              name: "지민",
              age: "26세",
              job: "웹 디자이너",
              mbti: "ENFP",
              // 구체적인 TMI 대신 넓은 카테고리 설정
              interests:
                "맛집(한식/일식), 여행(국내/해외), 영화/넷플릭스, 전시회, 소소한 일상",
              tone: "리액션이 좋고 질문이 많은",
              firstLine: `안녕하세요 ${currentName}씨! 사진보다 실물이 훨씬 좋으시네요 ㅎㅎ 오시느라 힘들진 않으셨어요?`,
            }
          : {
              name: "민준",
              age: "27세",
              job: "건축 설계사",
              mbti: "ISTJ",
              // 구체적인 TMI 대신 넓은 카테고리 설정
              interests: "운동/건강, 재테크, IT기기, 커피/카페, 드라이브",
              tone: "차분하고 경청을 잘하는",
              firstLine: `안녕하세요 ${currentName}씨, 맞으시죠? 실물이 더 아름다우시네요. 오는 길 안 막히셨어요?`,
            };

      // 3. 모델 초기화
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `
당신은 데이팅 앱 '랑데뷰'의 AI 연애 코치입니다. 사용자 이름은 '${currentName}'입니다.
'실시간 교정'과 '모범 답안 제시'를 해주는 1:1 과외 선생님입니다.

[🦸 페르소나 설정: 상대방 '${persona.name}']
- 기본: ${persona.age} / ${persona.job}
- 성격: ${persona.tone} 스타일.
- 관심사: ${persona.interests}
- 역할: 평소엔 코치로서 조언하다가, '1번 모드'가 되면 **${persona.name}**에 빙의하세요.

[⭐️ 핵심 모드 전환 로직]

1. [초기 상태 (메뉴 대기)]
  - 첫 인사: "안녕하세요 ${currentName}님! 랑데뷰 AI 코치입니다.🥰
  (상대: ${persona.name})
    1. 두근두근 소개팅 연습 🍷 (with ${persona.name})
    2. 대화 주제 추천받기 🧊"

2. [모드 1 진입 ("1", "소개팅" 입력 시)]
  - 🚫 금지: 진행 멘트 절대 금지.
  - ✅ 행동: 즉시 '${persona.name}'에 빙의하여 첫 대사 출력.
  - ${persona.name}의 첫 대사: "${persona.firstLine}"
   
  ★ [대화 전략 - 중요]: 
  - 억지로 본인의 설정(관심사)을 끼워 넣지 마세요.
   - **사용자의 말에 집중**하고, 그 내용에 대해 **'꼬리를 무는 질문'**을 하세요.
  - 예: 사용자가 "영화 좋아해요"라고 하면 -> "오 저도요! 최근에 본 것 중에 인생 영화 있으세요?"라고 반응.
  - 대화가 끊길 것 같을 때만 본인의 관심사(${persona.interests}) 중 하나를 꺼내세요.

3. [모드 2 진입 ("2", "아이스브레이킹" 입력 시)]
  - 역할: '${persona.name}'가 아닌 '코치'로서, ${persona.name}의 관심사(${persona.interests})를 바탕으로 자연스러운 질문 3가지를 추천하세요.

4. [핵심] 대화 평가 및 피드백 루프 (매 턴 실행)
  사용자의 답변을 평가하여 반응하세요.

  [상황 A: 답변이 좋을 때 (칭찬 + 대화 심화)]
  - 조건: 문장 완성도 높음, 매너 있음, 적절한 리액션.
   - 행동: 칭찬 후, **${persona.name}로서 호감 표시 + 되묻기**
  - 출력 형식:
    "💡 [코치] 좋아요! 아주 자연스러운 답변이었어요. 👍
    
    (${persona.name}) 아 정말요? 저랑 통하는 게 있네요! 그럼 ${currentName}씨는 주말에 주로 뭐 하세요?"

  [상황 B: 답변이 별로일 때 (지적 + 모범 답안)]
  - 조건: 단답형("ㅇㅇ", "네"), 무례함, 맥락 없음.
  - 출력 형식:
    "🚨 [코치] 잠깐만요 ${currentName}님! 대화가 너무 딱딱해요. 😫
    
    이렇게 바꿔보면 어떨까요?
    👉 [모범 답안]: '저는 주말에 맛있는 거 먹으러 다니는 거 좋아해요. ${persona.name}씨는 좋아하시는 음식 있으세요?'
    
    자, 위 예시를 참고해서 다시 답변해보세요!"

[절대 금지 사항]
- 답변이 'Bad' 판정을 받으면 대화 진도를 나가지 마세요.
- ★★★ 텍스트 강조 시 별표(*)를 절대 사용하지 마세요. 대신 대괄호([ ])를 사용하세요.
- ${persona.name}:, 나: 같은 이름표 붙이지 말 것. (코치 피드백 구간 제외)
`,
      });

      chatSessionRef.current = model.startChat({ history: [] });
      const result =
        await chatSessionRef.current.sendMessage("첫 인사와 메뉴를 보여줘.");
      addMessage(result.response.text(), "ai");
    } catch (error) {
      console.error(error);
      addMessage("🚨 연결 오류가 발생했습니다.", "ai");
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    initChat();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !chatSessionRef.current) return;
    const userMsg = inputText;
    setInputText("");
    addMessage(userMsg, "user");
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage(userMsg);
      addMessage(result.response.text(), "ai");
    } catch (error) {
      console.log(error);
      addMessage("⚠️ 전송 실패", "ai");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa] font-sans text-gray-800">
      {/* --- 메인 콘텐츠 영역 --- */}
      <main className="flex-1 flex flex-col items-center justify-center relative bg-[#f0f2f5]/30">
        {/* 상단 장식 요소 */}
        <div className="absolute top-10 left-10">
          <h2 className="text-2xl font-black text-gray-800 opacity-20">
            AI COACH
          </h2>
        </div>

        {/* 채팅창 컨테이너 */}
        <div className="w-full max-w-[480px] h-[85vh] flex flex-col bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative transition-all">
          {/* 채팅 헤더 */}
          <div className="p-6 bg-gradient-to-b from-[#fff0f3] to-white border-b border-pink-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-pink-50">
                🤖
              </div>
              <div>
                <h3 className="text-[16px] font-extrabold text-[#ee4b6f]">
                  AI 연애 코치
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {/* ★ [수정 4] 동적 이름 변수 사용 */}
                  <span className="text-[11px] text-gray-400 font-bold">
                    {userName}님 코칭 중
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-[#fafbfc]/50 scrollbar-hide">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-5 py-3.5 rounded-[22px] text-[14px] leading-relaxed shadow-sm whitespace-pre-wrap transition-all ${
                    msg.sender === "user"
                      ? "bg-[#ee4b6f] text-white rounded-br-none"
                      : "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-300 mt-1.5 px-2 font-bold uppercase">
                  {msg.sender === "user" ? "Me" : "AI Coach"}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center bg-white px-4 py-3 rounded-2xl border border-gray-50 self-start shadow-sm">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 영역 */}
          <div className="p-6 bg-white border-t border-gray-50">
            {/* items-center -> items-end로 변경 (줄바꿈 시 버튼 하단 고정) */}
            <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-[1.5rem] px-5 py-3 focus-within:ring-4 focus-within:ring-[#ee4b6f]/5 focus-within:bg-white transition-all shadow-inner group">
              {/* 텍스트에리어와 카운터를 감싸는 래퍼 (flex-col) */}
              <div className="flex-1 flex flex-col">
                <textarea
                  ref={textareaRef}
                  className="w-full bg-transparent outline-none text-[14px] text-gray-700 placeholder:text-gray-400 font-medium resize-none overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-2"
                  value={inputText}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_LENGTH) {
                      setInputText(e.target.value);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="답변을 입력하세요..."
                  rows={1}
                  style={{ maxHeight: "120px" }}
                />

                {/* ★ 글자 수 카운터 표시 */}
                <div className="text-right mt-1.5 mr-1">
                  <span
                    className={`text-[10px] font-bold tracking-wide transition-colors ${
                      inputText.length >= MAX_LENGTH
                        ? "text-red-500"
                        : "text-gray-300"
                    }`}
                  >
                    {inputText.length} / {MAX_LENGTH}
                  </span>
                </div>
              </div>

              {/* 전송 버튼 */}
              <button
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-md mb-0.5 ${
                  inputText.trim()
                    ? "bg-[#ee4b6f] text-white"
                    : "bg-gray-200 text-white cursor-not-allowed"
                }`}
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 우측 하단 장식 텍스트 */}
        <div className="absolute bottom-10 right-10 text-right">
          <p className="text-[11px] font-black text-gray-400 opacity-30 leading-tight uppercase">
            Powered by Gemini 2.5 Flash
            <br />
            Optimized for Rendezvous
          </p>
        </div>
      </main>
    </div>
  );
}
