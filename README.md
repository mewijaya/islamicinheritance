# islamicinheritance

Javascript library to calculate Islamic Inheritance Law.

### how to install

npm -i islamicinheritance

### How to Use

let asset = {
totalAsset: 1000000,
totalDebt: 0,
costOfFuneral: 0,
will: 0
};

let ahliWaris =
{
son: 2,
};

let waris = new Waris(asset, ahliWaris);
let output = waris.calculateWaris();

### Parameters

### Asset

- totalAsset : value of mayyit asset in integer
- totalDebt : value of mayyit debt in integer
- costOfFuneral : cost of mayyit funeral in integer
- will : value of mayyit will before die

### AhliWaris

- son
- sonOfSon
- husband
- father
- fatherOfFather
- brother
- brotherSameFather
- brotherSameMother
- sonOfBrother
- sonOfBrotherSameFather
- uncleFromFather
- uncleFromSameFather
- sonOfUncleFromFather
- sonOfUncleFromSameFather

- motherOfFather
- motherOfMother
- mother
- wife
- daughter
- daughterOfSon
- sister
- sisterSameFather
- sisterSameMother

### Result

Calculation : - : means no special calculation
aul: special case when divider more than divident
radd: special case when divider less than divident
umariyatani: special case solved by Umar bin Khattab ra.

Portion : portion of waris each ahli waris
