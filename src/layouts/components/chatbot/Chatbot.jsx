import { useState } from "react";
import { Button } from "primereact/button";
import { QUESTIONS_POOL } from "./questions";
import "./Chatbot.css";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [awaitingFeedback, setAwaitingFeedback] = useState(false);

  const reopenQuestions = () => {
    const shuffled = [...QUESTIONS_POOL].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 3));
    setAwaitingFeedback(false);
  };

  const startChat = () => {
    setOpen(true);
    setMessages([]);
    reopenQuestions();
  };

  const selectQuestion = (q) => {
    setQuestions([]);

    setMessages((prev) => [
      ...prev,
      { from: "user", text: q.question },
      { from: "bot", text: q.answer }
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "system", text: "¿Te sirvió esta respuesta?" }
      ]);

      setAwaitingFeedback(true);
    }, 300);
  };

  const handleFeedback = (ok) => {
    if (ok) {
      setMessages((prev) => [
        ...prev,
        { from: "user", text: "Sí, gracias" },
        { from: "bot", text: "¡Perfecto! Me alegra ayudarte." }
      ]);

      setTimeout(() => setOpen(false), 600);
    } else {
      setMessages((prev) => [
        ...prev,
        { from: "user", text: "No, no me sirvió" },
        { from: "bot", text: "Entendido, probemos con otras opciones." }
      ]);

      reopenQuestions();
    }
  };

  return (
    <>
      {!open && (
        <Button
          icon="pi pi-comments"
          className="chatbot-btn"
          onClick={startChat}
        />
      )}

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Asistente</span>
            <Button
              icon="pi pi-times"
              className="chatbot-close"
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="chatbot-body">
            {messages.map((msg, i) => {
              if (msg.from === "system") {
                return (
                  <div key={i} className="msg-feedback">
                    {msg.text}
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`msg-bubble ${msg.from === "user" ? "user" : "bot"}`}
                >
                  {msg.text}
                </div>
              );
            })}

            {!awaitingFeedback && questions.length > 0 && (
              <div className="question-options">
                {questions.map((q, i) => (
                  <Button
                    key={i}
                    label={q.question}
                    className="question-btn"
                    onClick={() => selectQuestion(q)}
                  />
                ))}

                <Button
                  label="Tengo otra consulta"
                  className="other-btn"
                  onClick={reopenQuestions}
                />
              </div>
            )}

            {awaitingFeedback && (
              <div className="feedback">
                <Button
                  label="Sí"
                  className="p-button-success feedback-btn"
                  onClick={() => handleFeedback(true)}
                />
                <Button
                  label="No"
                  className="p-button-danger feedback-btn"
                  onClick={() => handleFeedback(false)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
