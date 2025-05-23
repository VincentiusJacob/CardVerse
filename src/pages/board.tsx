import React, { useEffect, useState, useRef, useCallback } from "react";
import './board.css';

type CardData = {
  id: string;
  imageUrl: string;
  name: string;
  atk: number;
  health: number;
};

type Position = {
  left: number;
  top: number;
};

const deckData: CardData[] = [
  { id: "card1", imageUrl: "/image hack/Crystalon.png", name: "Crystalon", atk: 3, health: 4 },
  { id: "card2", imageUrl: "/image hack/Dustraze.png", name: "Dustraze", atk: 2, health: 6 },
  { id: "card3", imageUrl: "/image hack/Flarebeast.png", name: "Flarebeast", atk: 5, health: 3 },
  { id: "card4", imageUrl: "/image hack/Glacior.png", name: "Glacior", atk: 2, health: 7 },
  { id: "card5", imageUrl: "/image hack/Gravex.png", name: "Gravex", atk: 3, health: 5 },
  { id: "card6", imageUrl: "/image hack/IronWarden.png", name: "Iron Warden", atk: 3, health: 5 },
  { id: "card7", imageUrl: "/image hack/Mechroach.png", name: "Mechroach", atk: 3, health: 3 },
  { id: "card8", imageUrl: "/image hack/Oxitech.png", name: "Oxitech", atk: 2, health: 6 },
  { id: "card9", imageUrl: "/image hack/Phantomx.png", name: "Phantomx", atk: 2, health: 5 },
  { id: "card10", imageUrl: "/image hack/Quasar.png", name: "Quasar", atk: 5, health: 1 },
  { id: "card11", imageUrl: "/image hack/Thornex.png", name: "Thornex", atk: 2, health: 6 },
  { id: "card12", imageUrl: "/image hack/Thundernaut.png", name: "Thundernaut", atk: 3, health: 4 },
  { id: "card13", imageUrl: "/image hack/Zeorion.png", name: "Zeorion", atk: 3, health: 5 },
  { id: "card14", imageUrl: "/image hack/Nana.png", name: "Nana", atk: 4, health: 6 },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const CARD_SPACING = 200;
const SNAP_BACK_Y_OFFSET = 50;
const DRAG_TRIGGER_DISTANCE = 160;

const GameBoard: React.FC = () => {
  const [deck, setDeck] = useState<CardData[]>([]);
  const [snapBackPositions, setSnapBackPositions] = useState<Record<string, Position>>({});
  const draggingCardRef = useRef<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dynamicPositions, setDynamicPositions] = useState<Record<string, Position>>({});
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const shuffled = shuffleArray(deckData);
    setDeck(shuffled);

    function positionSnapBackCards() {
      const bottomCards = shuffled.slice(0, 4);
      const positions: Record<string, Position> = {};

      const total = bottomCards.length;
      const spacing = CARD_SPACING;

      const firstCardEl = cardRefs.current[bottomCards[0].id];
      if (!firstCardEl) return;

      const cardWidth = firstCardEl.offsetWidth;
      const cardHeight = firstCardEl.offsetHeight;

      const groupWidth = spacing * (total - 1) + cardWidth;
      const startX = window.innerWidth / 2 - groupWidth / 2;
      const y = window.innerHeight - SNAP_BACK_Y_OFFSET - cardHeight;

      bottomCards.forEach((card, idx) => {
        positions[card.id] = {
          left: startX + idx * spacing,
          top: y,
        };
      });

      setSnapBackPositions(positions);
      setDynamicPositions(positions);
    }

    setTimeout(positionSnapBackCards, 100);
    window.addEventListener("resize", positionSnapBackCards);
    return () => window.removeEventListener("resize", positionSnapBackCards);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent, cardId: string) => {
    if (e.button !== 0) return;
    e.preventDefault();

    const cardEl = cardRefs.current[cardId];
    if (!cardEl) return;

    draggingCardRef.current = cardId;
    dragOffsetRef.current = {
      x: e.clientX - dynamicPositions[cardId].left,
      y: e.clientY - dynamicPositions[cardId].top,
    };

    cardEl.setPointerCapture(e.pointerId);
    cardEl.style.cursor = "grabbing";
  }, [dynamicPositions]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const cardId = draggingCardRef.current;
    if (!cardId) return;
    e.preventDefault();

    const offset = dragOffsetRef.current;
    const newLeft = e.clientX - offset.x;
    const newTop = e.clientY - offset.y;

    setDynamicPositions((prev) => ({
      ...prev,
      [cardId]: { left: newLeft, top: newTop },
    }));

    const originalPos = snapBackPositions[cardId];
    if (!originalPos) return;

    const dragDistanceY = originalPos.top - newTop;
    if (dragDistanceY >= DRAG_TRIGGER_DISTANCE && !popupMessage) {
      setPopupMessage("Activate card to be your active card?");
    }
  }, [snapBackPositions, popupMessage]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const cardId = draggingCardRef.current;
    if (!cardId) return;

    e.preventDefault();

    const cardEl = cardRefs.current[cardId];
    if (cardEl) {
      cardEl.releasePointerCapture(e.pointerId);
      cardEl.style.cursor = "grab";
    }

    const originalPos = snapBackPositions[cardId];
    if (originalPos) {
      setDynamicPositions((prev) => ({
        ...prev,
        [cardId]: { ...originalPos },
      }));
    }

    draggingCardRef.current = null;
  }, [snapBackPositions]);

  const onConfirmPopup = () => {
    setPopupMessage(null);
  };

  return (
    <>
      {/* Static layout */}
      <div>
        <div className="health-img health-top-right">
          <img src="/image hack/healthbar.png" alt="Health Bar Top Right" />
        </div>

        <div className="health-img health-bottom-left">
          <img src="/image hack/healthbar.png" alt="Health Bar Bottom Left" />
        </div>

        <div className="deck deck-top-left">
          <img src="/image hack/deckImage.png" alt="Deck Top Left" />
        </div>

        <div className="deck deck-bottom-right">
          <img src="/image hack/deckImage.png" alt="Deck Bottom Right" />
        </div>

        <div className="circle-pair skill">
          <div className="circle" id="skill1">
            <img src="/image hack/overcharge.png" alt="Skill 1" />
          </div>
          <div className="circle" id="skill2">
            <img src="/image hack/firewall_S.png" alt="Skill 2" />
          </div>
        </div>

        <div className="circle-pair support">
          <div className="circle" id="support1">
            <img src="/image hack/shieldBoost.png" alt="Support 1" />
          </div>
          <div className="circle" id="support2">
            <img src="/image hack/systemHack.png" alt="Support 2" />
          </div>
        </div>

        <div className="card active-card" id="active1">
          <img src="" alt="Active 1" />
        </div>
        <div className="card active-card" id="active2">
          <img src="" alt="Active 2" />
        </div>
      </div>

      {/* Snap-back draggable cards */}
      <div>
        {deck.slice(0, 4).map((card) => {
          const pos = dynamicPositions[card.id] || { left: 0, top: 0 };
          return (
            <div
              key={card.id}
              id={card.id}
              className="card snap-back"
              style={{
                position: "fixed",
                left: pos.left,
                top: pos.top,
                cursor: "grab",
                userSelect: "none",
                touchAction: "none",
                width: 150,
                height: 200,
              }}
              ref={(el) => {
                cardRefs.current[card.id] = el as HTMLDivElement | null;
              }}
              onPointerDown={(e) => onPointerDown(e, card.id)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onLostPointerCapture={onPointerUp}
            >
              <img
                src={card.imageUrl}
                alt={card.name}
                draggable={false}
                style={{ width: "100%", height: "100%", pointerEvents: "none" }}
              />
            </div>
          );
        })}
      </div>

      {/* Popup */}
      {popupMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#222",
            color: "#fff",
            padding: 30,
            borderRadius: 16,
            zIndex: 9999,
            width: 300,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <p style={{ marginBottom: 20, fontSize: 18 }}>{popupMessage}</p>
          <button
            style={{
              padding: "10px 20px",
              fontSize: 16,
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={onConfirmPopup}
          >
            Confirm
          </button>
        </div>
      )}
    </>
  );
};

export default GameBoard;
