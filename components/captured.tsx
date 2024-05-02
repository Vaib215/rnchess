import React from 'react'
import { Image, Text, View, XStack } from 'tamagui';

export default function CapturedPieces({
  pieces,
}: {
  pieces: {
    asset: any;
    color: string;
    type: string;
  }[]
}) {
  return (
    <>
    <XStack pos={"absolute"} b={"$-8"} l={"0"} $sm={{b:"$-6"}}>
      {pieces.filter(piece => piece.color === 'white').map((piece, i) => (
        <Image 
          key={i} 
          source={piece.asset} 
          w={"$3"}
          h={"$3"}
          mx={"$-1.5"}
          $sm={{ w: "$2", h: "$2" }}
        />
      ))}
    </XStack>
    <XStack pos={"absolute"} t={"$-8"} l={"0"} $sm={{t:"$-6"}}>
      {pieces.filter(piece => piece.color === 'black').map((piece, i) => (
        <Image 
          key={i} 
          source={piece.asset} 
          w={"$3"}
          h={"$3"}
          mx={"$-1.5"}
          $sm={{ w: "$2", h: "$2" }}
        />
      ))}
    </XStack>
    </>
  )
}