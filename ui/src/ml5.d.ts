// Not quite there yet, but better than nothing
// TODO: JSDoc, based on website documentation
// TODO: Interface/class types for each of these ML algorithm instances
// TODO: Break this apart into multiple files for readability
// TODO: Test autocomplete in a vanilla JS project
// TODO: Test autocomplete in a TypeScript project

declare module "ml5" {
  import { MediaElement } from "p5";

  export as namespace ml5;

  type PoseNetOptions = {
    detectionType: "single" | "multiple";
    flipHorizontal: boolean;
    imageScaleFactor: number;
    maxPoseDetections: number;
    minConfidence: number;
    multiplier: number;
    nmsRadius: number;
    outputStride: number;
    scoreThreshold: number;
  };

  type ImageClassifierOptions = {
    alpha: number;
    topk: number;
    version: number;
  };

  type YoloOptions = {
    classProbThreshold: number;
    filterBoxesThreshold: number;
    IOUThreshold: number;
  };

  type SketchRnnModel =
    | "alarm_clock"
    | "ambulance"
    | "angel"
    | "ant"
    | "antyoga"
    | "backpack"
    | "barn"
    | "basket"
    | "bear"
    | "bee"
    | "beeflower"
    | "bicycle"
    | "bird"
    | "book"
    | "brain"
    | "bridge"
    | "bulldozer"
    | "bus"
    | "butterfly"
    | "cactus"
    | "calendar"
    | "castle"
    | "cat"
    | "catbus"
    | "catpig"
    | "chair"
    | "couch"
    | "crab"
    | "crabchair"
    | "crabrabbitfacepig"
    | "cruise_ship"
    | "diving_board"
    | "dog"
    | "dogbunny"
    | "dolphin"
    | "duck"
    | "elephant"
    | "elephantpig"
    | "eye"
    | "face"
    | "fan"
    | "fire_hydrant"
    | "firetruck"
    | "flamingo"
    | "flower"
    | "floweryoga"
    | "frog"
    | "frogsofa"
    | "garden"
    | "hand"
    | "hedgeberry"
    | "hedgehog"
    | "helicopter"
    | "kangaroo"
    | "key"
    | "lantern"
    | "lighthouse"
    | "lion"
    | "lionsheep"
    | "lobster"
    | "map"
    | "mermaid"
    | "monapassport"
    | "monkey"
    | "mosquito"
    | "octopus"
    | "owl"
    | "paintbrush"
    | "palm_tree"
    | "parrot"
    | "passport"
    | "peas"
    | "penguin"
    | "pig"
    | "pigsheep"
    | "pineapple"
    | "pool"
    | "postcard"
    | "power_outlet"
    | "rabbit"
    | "rabbitturtle"
    | "radio"
    | "radioface"
    | "rain"
    | "rhinoceros"
    | "rifle"
    | "roller_coaster"
    | "sandwich"
    | "scorpion"
    | "sea_turtle"
    | "sheep"
    | "skull"
    | "snail"
    | "snowflake"
    | "speedboat"
    | "spider"
    | "squirrel"
    | "steak"
    | "stove"
    | "strawberry"
    | "swan"
    | "swing_set"
    | "the_mona_lisa"
    | "tiger"
    | "toothbrush"
    | "toothpaste"
    | "tractor"
    | "trombone"
    | "truck"
    | "whale"
    | "windmill"
    | "yoga"
    | "yogabicycle"
    | "everything";

  export function imageClassifier(
    model: "MobileNet" | "Darknet" | "Darknet-tiny" | string,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function imageClassifier(
    model: "MobileNet" | "Darknet" | "Darknet-tiny" | string,
    options?: ImageClassifierOptions,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function imageClassifier(
    model: "MobileNet" | "Darknet" | "Darknet-tiny" | string,
    video?: MediaElement | HTMLVideoElement,
    options?: ImageClassifierOptions,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function poseNet(
    video?: MediaElement | HTMLVideoElement,
    type?: "single" | "multiple",
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function poseNet(
    video?: MediaElement | HTMLVideoElement,
    options?: PoseNetOptions,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function poseNet(
    callback?: (error: any, result: any) => void,
    options?: PoseNetOptions
  ): undefined | Promise<any>;

  export function bodyPix(
    video?: MediaElement | HTMLVideoElement,
    type?: "single" | "multiple",
    callback?: (error: any, result: any) => void,
    options?: any
  ): undefined | Promise<any>;

  export function uNet(
    model: string,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function styleTransfer(
    model: string,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function styleTransfer(
    model: string,
    video?: MediaElement | HTMLVideoElement,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function pix2pix(
    model: string,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function CVAE(
    model: string,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function DCGAN(
    modelPath: string,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function SketchRNN(
    model: string,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function YOLO(
    video?: MediaElement | HTMLVideoElement,
    options?: YoloOptions,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function YOLO(
    options?: YoloOptions,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function soundClassifier(
    model: string,
    options?: { probabilityThreshold: number },
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function pitchDetection(
    model: "CREPE",
    audioContext: AudioContext,
    stream: MediaStream,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function charRNN(
    model: string,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function sentiment(
    model: string,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function word2vec(
    model: string,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export function SketchRNN(
    model: SketchRnnModel | string,
    callback?: (error: any, result: any) => void
  ): undefined | Promise<any>;

  export type Part =
    | "nose"
    | "leftEye"
    | "rightEye"
    | "leftAnkle"
    | "rightAnkle"
    | "leftEar"
    | "rightEar"
    | "leftShoulder"
    | "rightShoulder"
    | "leftElbow"
    | "rightElbow"
    | "leftWrist"
    | "rightWrist"
    | "leftHip"
    | "rightHip"
    | "leftKnee"
    | "rightKnee";

  export type PosePose = {
    pose: Pose;
  };

  export type Pose = {
    score: number;
    keypoints: {
      score: number;
      part: Part;
      position: {
        x: number;
        y: number;
      };
    }[];
    [key: string]: {
      x: number;
      y: number;
      confidence: number;
    };
    // "nose": {
    //     "x": 341.6791222717047,
    //     "y": 215.31527389348247,
    //     "confidence": 0.9995145797729492
    // },
    // "leftEye": {
    //     "x": 365.73396556572226,
    //     "y": 189.6919078307393,
    //     "confidence": 0.999583899974823
    // },
    // "rightEye": {
    //     "x": 314.72239216014106,
    //     "y": 191.5440659578672,
    //     "confidence": 0.9987397789955139
    // },
    // "leftEar": {
    //     "x": 412.0409111290126,
    //     "y": 199.88132105727135,
    //     "confidence": 0.9856841564178467
    // },
    // "rightEar": {
    //     "x": 287.8146516673759,
    //     "y": 212.21161482399071,
    //     "confidence": 0.7952558994293213
    // },
    // "leftShoulder": {
    //     "x": 465.25197307423394,
    //     "y": 365.18315296692606,
    //     "confidence": 0.8681748509407043
    // },
    // "rightShoulder": {
    //     "x": 218.894743566847,
    //     "y": 379.46743145063226,
    //     "confidence": 0.7183769941329956
    // },
    // "leftElbow": {
    //     "x": 460.31911174610894,
    //     "y": 528.2865222975437,
    //     "confidence": 0.04257797449827194
    // },
    // "rightElbow": {
    //     "x": 164.9765489630198,
    //     "y": 464.06399619254614,
    //     "confidence": 0.022120414301753044
    // },
    // "leftWrist": {
    //     "x": 367.3705864694795,
    //     "y": 364.67551621017753,
    //     "confidence": 0.02177339233458042
    // },
    // "rightWrist": {
    //     "x": 310.6507820099708,
    //     "y": 369.6139775732612,
    //     "confidence": 0.03298686817288399
    // },
    // "leftHip": {
    //     "x": 452.2936631733341,
    //     "y": 543.1522639530641,
    //     "confidence": 0.018404453992843628
    // },
    // "rightHip": {
    //     "x": 454.45925226471303,
    //     "y": 539.7765970786721,
    //     "confidence": 0.019662102684378624
    // },
    // "leftKnee": {
    //     "x": 448.20858729024803,
    //     "y": 382.8147989117217,
    //     "confidence": 0.01268194429576397
    // },
    // "rightKnee": {
    //     "x": 137.92605032716742,
    //     "y": 510.8784075191512,
    //     "confidence": 0.012136613018810749
    // },
    // "leftAnkle": {
    //     "x": 491.58974970361135,
    //     "y": 520.8127840390929,
    //     "confidence": 0.016868995502591133
    // },
    // "rightAnkle": {
    //     "x": 391.317404661661,
    //     "y": 443.4761730149562,
    //     "confidence": 0.010854098945856094
    // }

    //   skeleton: [
    //     [
    //       {
    //         score: 0.8681748509407043;
    //         part: "leftShoulder";
    //         position: {
    //           x: 465.25197307423394;
    //           y: 365.18315296692606;
    //         };
    //       },
    //       {
    //         score: 0.7183769941329956;
    //         part: "rightShoulder";
    //         position: {
    //           x: 218.894743566847;
    //           y: 379.46743145063226;
    //         };
    //       }
    //     ]
    //   ];
  };
}
