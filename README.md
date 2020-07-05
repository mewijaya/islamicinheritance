# islamicinheritance

Javascript library to calculate Islamic Inheritance Law.

### how to install

npm -i islamicinheritance

### parameters

asset

{
totalAsset: integer,
totalDebt: integer,
costOfFuneral: integer,
will: integer
}

ahliWaris

{
son: integer,
sonOfSon: integer,
husband: integer,
father: integer,
fatherOfFather: integer,
brother: integer,
brotherSameFather: integer,
brotherSameMother: integer,
sonOfBrother: integer,
sonOfBrotherSameFather: integer,
uncleFromFather: integer,
uncleFromSameFather: integer,
sonOfUncleFromFather: integer,
sonOfUncleFromSameFather: integer,

motherOfFather: integer,
motherOfMother: integer,
mother: integer,
wife: integer,
daughter: integer,
daughterOfSon: integer,
sister: integer,
sisterSameFather: integer,
sisterSameMother: integer
}

### how to use

let waris = new Waris(asset, ahliWaris)
