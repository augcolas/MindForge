import React, { useEffect } from "react";
import twoC from "../assets/cards/2-C.png";
import twoD from "../assets/cards/2-D.png";
import twoH from "../assets/cards/2-H.png";
import twoS from "../assets/cards/2-S.png";
import threeC from "../assets/cards/3-C.png";
import threeD from "../assets/cards/3-D.png";
import threeH from "../assets/cards/3-H.png";
import threeS from "../assets/cards/3-S.png";
import fourC from "../assets/cards/4-C.png";
import fourD from "../assets/cards/4-D.png";
import fourH from "../assets/cards/4-H.png";
import fourS from "../assets/cards/4-S.png";
import fiveC from "../assets/cards/5-C.png";
import fiveD from "../assets/cards/5-D.png";
import fiveH from "../assets/cards/5-H.png";
import fiveS from "../assets/cards/5-S.png";
import sixC from "../assets/cards/6-C.png";
import sixD from "../assets/cards/6-D.png";
import sixH from "../assets/cards/6-H.png";
import sixS from "../assets/cards/6-S.png";
import sevenC from "../assets/cards/7-C.png";
import sevenD from "../assets/cards/7-D.png";
import sevenH from "../assets/cards/7-H.png";
import sevenS from "../assets/cards/7-S.png";
import eightC from "../assets/cards/8-C.png";
import eightD from "../assets/cards/8-D.png";
import eightH from "../assets/cards/8-H.png";
import eightS from "../assets/cards/8-S.png";
import nineC from "../assets/cards/9-C.png";
import nineD from "../assets/cards/9-D.png";
import nineH from "../assets/cards/9-H.png";
import nineS from "../assets/cards/9-S.png";
import tenC from "../assets/cards/10-C.png";
import tenD from "../assets/cards/10-D.png";
import tenH from "../assets/cards/10-H.png";
import tenS from "../assets/cards/10-S.png";
import jackC from "../assets/cards/J-C.png";
import jackD from "../assets/cards/J-D.png";
import jackH from "../assets/cards/J-H.png";
import jackS from "../assets/cards/J-S.png";
import queenC from "../assets/cards/Q-C.png";
import queenD from "../assets/cards/Q-D.png";
import queenH from "../assets/cards/Q-H.png";
import queenS from "../assets/cards/Q-S.png";
import kingC from "../assets/cards/K-C.png";
import kingD from "../assets/cards/K-D.png";
import kingH from "../assets/cards/K-H.png";
import kingS from "../assets/cards/K-S.png";
import aceC from "../assets/cards/A-C.png";
import aceD from "../assets/cards/A-D.png";
import aceH from "../assets/cards/A-H.png";
import aceS from "../assets/cards/A-S.png";
import backBlue from "../assets/cards/BackBlue.png";
import { Image } from "react-native";
import { Card } from "../models/card";
import { Color, Value } from "../models/enum";

export const CardImage = (props: { card:any }) => {

    const realCard = props.card === "back" ?
        new Card(Value.Back, Color.Back) :
        new Card(props.card._value, props.card._color)

    const cards = {
        "2-C": twoC,
        "2-D": twoD,
        "2-H": twoH,
        "2-S": twoS,
        "3-C": threeC,
        "3-D": threeD,
        "3-H": threeH,
        "3-S": threeS,
        "4-C": fourC,
        "4-D": fourD,
        "4-H": fourH,
        "4-S": fourS,
        "5-C": fiveC,
        "5-D": fiveD,
        "5-H": fiveH,
        "5-S": fiveS,
        "6-C": sixC,
        "6-D": sixD,
        "6-H": sixH,
        "6-S": sixS,
        "7-C": sevenC,
        "7-D": sevenD,
        "7-H": sevenH,
        "7-S": sevenS,
        "8-C": eightC,
        "8-D": eightD,
        "8-H": eightH,
        "8-S": eightS,
        "9-C": nineC,
        "9-D": nineD,
        "9-H": nineH,
        "9-S": nineS,
        "10-C": tenC,
        "10-D": tenD,
        "10-H": tenH,
        "10-S": tenS,
        "J-C": jackC,
        "J-D": jackD,
        "J-H": jackH,
        "J-S": jackS,
        "Q-C": queenC,
        "Q-D": queenD,
        "Q-H": queenH,
        "Q-S": queenS,
        "K-C": kingC,
        "K-D": kingD,
        "K-H": kingH,
        "K-S": kingS,
        "A-C": aceC,
        "A-D": aceD,
        "A-H": aceH,
        "A-S": aceS,
        "Back-Blue": backBlue
    };

    useEffect(() => {
        console.log(realCard.name());
    }, []);

    return (
        <Image source={cards[realCard.name()]} style={styles.card}></Image>
    );
}

const styles = {
    card: {
        width: 80,
        height: 120,
        margin: 5
    },
}