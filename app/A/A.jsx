import React, { useRef, useState } from "react";
import { View, Dimensions, PanResponder, Text } from "react-native";
import { Canvas, Path, Skia, Group, Circle } from "@shopify/react-native-skia";

const { width } = Dimensions.get("window");

const A = () => {
  const bottomY = 350;
  const topY = 100;
  const midY = 225;
  const centerX = width / 2;
  const spreadX = 120;

  const leftStart = { x: centerX - spreadX, y: bottomY };
  const leftEnd = { x: centerX, y: topY };

  const rightStart = { x: centerX + spreadX, y: bottomY };
  const rightEnd = { x: centerX, y: topY };

  const crossbarStart = { x: centerX - spreadX / 1.5, y: midY };
  const crossbarEnd = { x: centerX + spreadX / 1.5, y: midY };

  // Add these to state
  const [pos1, setPos1] = useState(0);
  const [pos2, setPos2] = useState(0);
  const [pos3, setPos3] = useState(0);

  // Control activation
  const [isSecondActive, setIsSecondActive] = useState(false);
  const [isThirdActive, setIsThirdActive] = useState(false);
  // Clamp helper that only allows forward movement
  const forwardClamp = (newVal, oldVal, min = 0, max = 1) =>
    Math.max(Math.min(newVal, max), Math.max(oldVal, min));

  const clamp = (num, min = 0, max = 1) => Math.min(Math.max(num, min), max);

  function getT(start, end, point) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSq = dx * dx + dy * dy;
    if (lengthSq === 0) return 0;
    let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSq;
    return clamp(t);
  }

  function createPanResponder(start, end, setPos) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const touchX = evt.nativeEvent.pageX;
        const touchY = evt.nativeEvent.pageY;

        const t = getT(start, end, { x: touchX, y: touchY });
        setPos(t);
      },
    });
  }

  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  const leftStartAbs = {
    x: leftStart.x + canvasOffset.x,
    y: leftStart.y + canvasOffset.y,
  };
  const leftEndAbs = {
    x: leftEnd.x + canvasOffset.x,
    y: leftEnd.y + canvasOffset.y,
  };

  const rightStartAbs = {
    x: rightStart.x + canvasOffset.x,
    y: rightStart.y + canvasOffset.y,
  };
  const rightEndAbs = {
    x: rightEnd.x + canvasOffset.x,
    y: rightEnd.y + canvasOffset.y,
  };

  const crossbarStartAbs = {
    x: crossbarStart.x + canvasOffset.x,
    y: crossbarStart.y + canvasOffset.y,
  };
  const crossbarEndAbs = {
    x: crossbarEnd.x + canvasOffset.x,
    y: crossbarEnd.y + canvasOffset.y,
  };

  const pan1 = useRef(
    createPanResponder(leftStartAbs, leftEndAbs, setPos1)
  ).current;
  const pan2 = useRef(
    createPanResponder(rightStartAbs, rightEndAbs, setPos2)
  ).current;
  const pan3 = useRef(
    createPanResponder(crossbarStartAbs, crossbarEndAbs, setPos3)
  ).current;

  const leftPath = Skia.Path.Make();
  leftPath.moveTo(leftStart.x, leftStart.y);
  leftPath.lineTo(leftEnd.x, leftEnd.y);

  const rightPath = Skia.Path.Make();
  rightPath.moveTo(rightStart.x, rightStart.y);
  rightPath.lineTo(rightEnd.x, rightEnd.y);

  const crossbarPath = Skia.Path.Make();
  crossbarPath.moveTo(crossbarStart.x, crossbarStart.y);
  crossbarPath.lineTo(crossbarEnd.x, crossbarEnd.y);

  const createPartialPath = (start, end, progress) => {
    const p = Skia.Path.Make();
    p.moveTo(start.x, start.y);
    p.lineTo(
      start.x + (end.x - start.x) * progress,
      start.y + (end.y - start.y) * progress
    );
    return p;
  };

  // Check if all sliders are done (you can adjust threshold if needed)
  const allDone = pos1 >= 0.99 && pos2 >= 0.99 && pos3 >= 0.99;

  return (
    <View
      style={{ flex: 1, backgroundColor: "white" }}
      onLayout={(event) => {
        const { x, y } = event.nativeEvent.layout;
        setCanvasOffset({ x, y });
      }}
    >
      <Canvas style={{ width, height: 400 }}>
        {/* Left */}
        <Group>
          <Path path={leftPath} style="stroke" strokeWidth={6} color="gray" />
          <Path
            path={createPartialPath(leftStart, leftEnd, pos1)}
            style="stroke"
            strokeWidth={6}
            color="red"
          />
          <Circle
            cx={leftStart.x + (leftEnd.x - leftStart.x) * pos1}
            cy={leftStart.y + (leftEnd.y - leftStart.y) * pos1}
            r={15}
            color="red"
          />
        </Group>

        {/* Right */}
        <Group>
          <Path path={rightPath} style="stroke" strokeWidth={6} color="gray" />
          <Path
            path={createPartialPath(rightStart, rightEnd, pos2)}
            style="stroke"
            strokeWidth={6}
            color="red"
          />
          <Circle
            cx={rightStart.x + (rightEnd.x - rightStart.x) * pos2}
            cy={rightStart.y + (rightEnd.y - rightStart.y) * pos2}
            r={15}
            color="red"
          />
        </Group>

        {/* Crossbar */}
        <Group>
          <Path
            path={crossbarPath}
            style="stroke"
            strokeWidth={6}
            color="gray"
          />
          <Path
            path={createPartialPath(crossbarStart, crossbarEnd, pos3)}
            style="stroke"
            strokeWidth={6}
            color="red"
          />
          <Circle
            cx={crossbarStart.x + (crossbarEnd.x - crossbarStart.x) * pos3}
            cy={crossbarStart.y + (crossbarEnd.y - crossbarStart.y) * pos3}
            r={15}
            color="red"
          />
        </Group>
      </Canvas>

      {/* Numbers on circles */}
      <Text
        style={{
          position: "absolute",
          left: leftStart.x + (leftEnd.x - leftStart.x) * pos1 - 5,
          top: leftStart.y + (leftEnd.y - leftStart.y) * pos1 - 30,
          fontWeight: "bold",
          fontSize: 18,
          color: "black",
        }}
      >
        1
      </Text>
      <Text
        style={{
          position: "absolute",
          left: rightStart.x + (rightEnd.x - rightStart.x) * pos2 - 5,
          top: rightStart.y + (rightEnd.y - rightStart.y) * pos2 - 30,
          fontWeight: "bold",
          fontSize: 18,
          color: "black",
        }}
      >
        2
      </Text>
      <Text
        style={{
          position: "absolute",
          left: crossbarStart.x + (crossbarEnd.x - crossbarStart.x) * pos3 - 5,
          top: crossbarStart.y + (crossbarEnd.y - crossbarStart.y) * pos3 - 30,
          fontWeight: "bold",
          fontSize: 18,
          color: "black",
        }}
      >
        3
      </Text>

      {/* Show "Done" when all sliders are completed */}
      {allDone && (
        <View
          style={{
            position: "absolute",
            top: 380,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "green",
            }}
          >
            Done!
          </Text>
        </View>
      )}

      {/* Invisible touch areas with pan handlers */}
      <View
        {...pan1.panHandlers}
        style={{
          position: "absolute",
          left: leftStart.x - 40,
          top: topY - 40,
          width: spreadX + 80,
          height: bottomY - topY + 80,
          backgroundColor: "transparent",
        }}
      />
      <View
        {...pan2.panHandlers}
        style={{
          position: "absolute",
          left: rightStart.x - 40,
          top: topY - 40,
          width: spreadX + 80,
          height: bottomY - topY + 80,
          backgroundColor: "transparent",
        }}
      />
      <View
        {...pan3.panHandlers}
        style={{
          position: "absolute",
          left: crossbarStart.x - 40,
          top: midY - 40,
          width: crossbarEnd.x - crossbarStart.x + 80,
          height: 80,
          backgroundColor: "transparent",
        }}
      />
    </View>
  );
};

export default A;
