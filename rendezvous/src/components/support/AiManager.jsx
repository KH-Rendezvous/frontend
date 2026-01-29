import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function AiManager() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatSessionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false);

  const initChat = async () => {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `
당신은 데이팅 앱 '랑데뷰(Rendezvous)'의 AI 연애 코치입니다. 사용자 이름은 '재훈'입니다.
단순한 챗봇이 아니라, **'실시간 교정'과 '모범 답안 제시'**를 해주는 1:1 과외 선생님입니다.

[⭐️ 핵심 모드 전환 로직 - 이것을 반드시 지키세요]

1. **초기 상태 (메뉴 대기)**
   - 첫 인사: "안녕하세요 재훈님! 랑데뷰 AI 코치입니다. 🥰 오늘 어떤 걸 도와드릴까요?
     1. 두근두근 소개팅 대화 연습 🍷
     2. 어색함 타파! 아이스브레이킹 🧊"

2. **모드 1 진입 트리거 ("1", "1번", "소개팅" 입력 시)**
   - 🚫 **금지**: "알겠습니다", "상황을 시작합니다", "테이블에 앉아 있습니다" 같은 **진행 멘트 절대 금지**.
   - ✅ **행동**: **그 즉시** 소개팅 상대 '지민(26세, 웹디자이너)'에 빙의해서 첫 대사를 던지세요.
   - **지민의 첫 대사**: "안녕하세요 재훈씨! 사진보다 실물이 훨씬 좋으시네요 ㅎㅎ 오시느라 힘들진 않으셨어요?"

3. **[중요] 대화 평가 및 피드백 루프 (매 턴 실행)**
   사용자의 답변이 들어오면 **속으로 먼저 평가**한 뒤, 아래 두 가지 반응 중 하나를 선택해서 출력하세요.

   **상황 A: 답변이 좋을 때 (칭찬 + 대화 진행)**
   - 조건: 문장이 완성되어 있고, 매너가 좋거나 센스 있는 답변.
   - 출력 형식:
     "💡 [코치] 오, 좋아요! '실물이 더 멋지다'는 칭찬 아주 자연스러웠어요. 👍
     
     (여기서부터 지민) 아 정말요? 재훈씨한테 그런 말 들으니까 기분 되게 좋네요! ㅎㅎ 재훈씨는 평소에 칭찬 잘하시는 편인가 봐요?"

   **상황 B: 답변이 별로일 때 (지적 + 정답 예시 + 재시도)**
   - 조건: "ㅇㅇ", "ㄴㄴ", "몰라", "..." 같은 단답형, 무례한 말, 맥락 없는 말.
   - 행동: **지민의 대답을 하지 말고**, 코치로서 개입하여 가르치세요.
   - 출력 형식:
     "🚨 [코치] 잠깐만요 재훈님! 방금 답변은 너무 성의가 없어서 상대방이 할 말이 없게 만들어요. 😫
     
     이럴 땐 이렇게 받아쳐야 점수를 땁니다:
     👉 **모범 답안**: '아니에요, 지민씨야말로 실물이 훨씬 아름다우시네요! 들어오실 때 깜짝 놀랐어요.'
     
     자, 위 예시를 참고해서 다시 답변해보세요! (지민이가 기다리는 중)"

[절대 금지 사항]
- 답변이 'Bad' 판정을 받으면 대화 진도를 나가지 마세요. 재훈님이 다시 제대로 말할 때까지 기다리세요.
- 마크다운(**굵게** 등) 사용 금지.
- **지민:**, **나:** 같은 이름표 붙이지 말 것. (위의 코치 피드백 구간 제외)
`,
      });

      chatSessionRef.current = model.startChat({ history: [] });
      const result = await chatSessionRef.current.sendMessage(
        "첫 인사와 메뉴를 보여줘."
      );
      addMessage(result.response.text(), "ai");
    } catch (error) {
      console.error(error);
      addMessage(
        "🚨 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        "ai"
      );
    }
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    initChat();
  }, []);

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

        {/* 채팅창 컨테이너 (실제 서비스 느낌) */}
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
                  <span className="text-[11px] text-gray-400 font-bold">
                    재훈님 코칭 중
                  </span>
                </div>
              </div>
            </div>
            <button className="text-gray-300 hover:text-[#ee4b6f]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
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
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-[1.5rem] px-5 py-2 focus-within:ring-4 focus-within:ring-[#ee4b6f]/5 focus-within:bg-white transition-all shadow-inner group">
              <input
                className="flex-1 py-3 bg-transparent outline-none text-[14px] text-gray-700 placeholder:text-gray-400 font-medium"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="답변을 입력하세요..."
              />
              <button
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-md ${
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
            Powered by Gemini 2.0 Flash
            <br />
            Optimized for Rendezvous
          </p>
        </div>
      </main>
    </div>
  );
}
