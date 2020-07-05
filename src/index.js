import { findLCM, findGCD } from './util.js';

class Waris {
  constructor(asset, ahliWaris) {
    this.ahliWaris = ahliWaris;
    this.ashabulFurud = {};
    this.ashobah = {};
    this.divident = 0;
    this.portion = {};
    this.hajbAhliWaris = {};
    this.calculation = '';
    this.asset = asset;
    this.balance = 0;
    this.errorMessage = {};
    this.male = [
      'son',
      'sonOfSon',
      'husband',
      'father',
      'fatherOfFather',
      'brother',
      'brotherSameFather',
      'brotherSameMother',
      'sonOfBrother',
      'sonOfBrotherSameFather',
      'uncleFromFather',
      'uncleFromSameFather',
      'sonOfUncleFromFather',
      'sonOfUncleFromSameFather'
    ];
    this.female = [
      'motherOfFather',
      'motherOfMother',
      'mother',
      'wife',
      'daughter',
      'daughterOfSon',
      'sister',
      'sisterSameFather',
      'sisterSameMother'
    ];
    this.numberOfAshobah = 0;
  }

  validateAsset() {
    if (!('totalAsset' in this.asset) || this.asset['totalAsset'] < 0) {
      this.errorMessage['totalAsset'] =
        'total asset required and must not less than equal zero';
    }

    this.balance =
      this.asset['totalAsset'] -
      ('totalAsset' in this.asset ? this.asset['totalDebt'] : 0) -
      ('costOfFuneral' in this.asset ? this.asset['costOfFuneral'] : 0);

    if ('will' in this.asset && this.asset['will'] > this.balance / 3) {
      this.errorMessage['will'] =
        'will  must not more than 1/3 (asset - (debt and funeral))';
    }

    if (this.balance <= 0) {
      this.errorMessage['totalAsset'] = 'no heir available';
    }
  }

  validateAhliWaris() {
    if (this.has('husband') && this.has('wife')) {
      this.errorMessage[
        'ahliWaris'
      ] = `ahli waris musn't include both husband and wife`;
    }

    this.maxNum('wife', 4);
    this.maxNum('husband', 1);
    this.maxNum('father', 1);
    this.maxNum('mother', 1);
    this.maxNum('fatherOfFather', 1);
    this.maxNum('motherOfFather', 1);
    this.maxNum('motherOfFather', 1);
  }

  maxNum(key, max) {
    if (this.has(key) && this.ahliWaris[key] > max) {
      this.errorMessage[key] = `${key} musn't more than ${max}`;
    }
  }

  hasPosterity() {
    if (
      !this.has('son') &&
      !this.has('daughter') &&
      !this.has('sonOfSon') &&
      !this.has('daughterOfSon')
    )
      return false;
    return true;
  }

  hasAncestry() {
    if (!this.has('father') && !this.has('fatherOfFather')) return false;
    return true;
  }

  has(key) {
    return key in this.ahliWaris && this.ahliWaris[key] >= 1;
  }

  isUmariyatani() {
    if (
      this.has('mother') &&
      this.hasAncestry() &&
      (this.has('husband') || this.has('wife')) &&
      !this.hasPosterity() &&
      !this.has('brother') &&
      !this.has('brotherSameFather') &&
      !this.has('brotherSameMother') &&
      !this.has('sonOfBrother') &&
      !this.has('sonOfBrotherSameFather') &&
      !this.has('sonOfBrotherSameMother') &&
      !this.has('uncleFromFather') &&
      !this.has('uncleFromSameFather') &&
      !this.has('sonOfUncleFromFather') &&
      !this.has('sonOfUncleFromSameFather') &&
      !this.has('motherOfFather') &&
      !this.has('motherOfMother') &&
      !this.has('sisterSameFather') &&
      !this.has('sisterSameMother')
    )
      return true;
    return false;
  }

  calculateAshabulFurudh() {
    if (this.has('father'))
      if (this.hasPosterity()) this.ashabulFurud['father'] = '1/6';

    if (this.has('fatherOfFather'))
      if (!this.has('father') && !this.hasPosterity())
        this.ashabulFurud['fatherOfFather'] = '1/6';

    if (this.has('husband'))
      if (!this.hasPosterity()) this.ashabulFurud['husband'] = '1/2';
      else this.ashabulFurud['husband'] = '1/4';

    if (this.has('daughter')) {
      if (this.ahliWaris.daughter == 1 && !this.has('son'))
        this.ashabulFurud['daughter'] = '1/2';
      if (this.ahliWaris.daughter >= 2 && !this.has('son'))
        this.ashabulFurud['daughter'] = '2/3';
    }

    if (this.has('daughterOfSon')) {
      if (!this.has('sonOfSon') && !this.has('son')) {
        if (!this.has('daughter')) {
          if (this.ahliWaris.daughterOfSon == 1)
            this.ashabulFurud['daughterOfSon'] = '1/2';

          if (this.ahliWaris.daughterOfSon >= 2)
            this.ashabulFurud['daughterOfSon'] = '2/3';
        } else if (this.has('daughter') && this.daughter == 1) {
          if (this.ahliWaris.daughterOfSon >= 1)
            this.ashabulFurud['daughterOfSon'] = '1/6';
        }
      }
    }

    if (this.has('mother')) {
      let numberOfSiblings = 0;
      let siblings = [
        'brother',
        'broterSameFather',
        'brotherSameMother',
        'sister',
        'sisterSameFather',
        'sisterSameMother'
      ];
      for (let index in siblings) {
        if (this.has(siblings[index]))
          numberOfSiblings += this.ahliWaris[siblings[index]];
      }

      if (!this.hasPosterity() && numberOfSiblings < 2 && !this.isUmariyatani())
        this.ashabulFurud['mother'] = '1/3';

      if (this.hasPosterity() || numberOfSiblings >= 2)
        this.ashabulFurud['mother'] = '1/6';
    }

    if (this.has('motherOfMother') || this.has('motherOfFather')) {
      if (!this.has('mother')) {
        if (!this.has('motherOfMother')) {
          this.ashabulFurud['motherOfMother'] = '1/6';
        } else if (!this.has('motherOfMother')) {
          this.ashabulFurud['motherOfFather'] = '1/6';
        } else {
          this.ashabulFurud['motherOfMother'] = '1/12';
          this.ashabulFurud['motherOfFather'] = '1/12';
        }
      }
    }

    if (this.has('sister')) {
      if (!this.hasAncestry() && !this.hasPosterity() && !this.has('brother')) {
        if (this.ahliWaris['sister'] == 1) {
          this.ashabulFurud['sister'] = '1/2';
        } else if (this.ahliWaris['sister'] >= 2) {
          this.ashabulFurud['sister'] = '2/3';
        }
      }
    }

    if (this.has('sisterSameFather')) {
      if (!this.hasAncestry() && !this.hasPosterity()) {
        if (!this.has('brother') && !this.has('sister')) {
          if (this.sisterSameFather == 1) {
            this.ashabulFurud['sisterSameFather'] = '1/2';
          } else if (this.sisterSameFather > 1) {
            this.ashabulFurud['sisterSameFather'] = '2/3';
          }
        } else if (!this.has('brother') && this.sister == 1) {
          if (!this.has('brotherSameFather')) {
            this.ashabulFurud['sisterSameFather'] = '1/6';
          }
        }
      }
    }

    if (this.has('sisterSameMother') || this.has('brotherSameMother')) {
      if (!this.hasPosterity() && !this.hasAncestry()) {
        if (!this.has('brotherSameMother')) {
          if (this.ahliWaris['sisterSameMother'] == 1)
            this.ashabulFurud['sisterSameMother'] = '1/6';
          else if (this.ahliWaris['sisterSameMother'] >= 2)
            this.ashabulFurud['sisterSameMother'] = '1/3';
        } else if (!this.has('sisterSameMother')) {
          if (this.ahliWaris['brotherSameMother'] == 1)
            this.ashabulFurud['brotherSameMother'] = '1/6';
          else if (this.ahliWaris['brotherSameMother'] >= 2)
            this.ashabulFurud['brotherSameMother'] = '1/3';
        } else {
          this.ashabulFurud['siblingSameMother'] = '1/3';
        }
      }
    }

    if (this.has('wife')) {
      if (!this.hasPosterity()) this.ashabulFurud['wife'] = '1/4';
      else this.ashabulFurud['wife'] = '1/8';
    }

    return this.ashabulFurud;
  }

  chooseAsobah() {
    if (this.has('son')) {
      if (this.has('daughter')) {
        this.ashobah['daughter'] = `bil ghoir`;
      }
      this.ashobah['son'] = 'bin nafs';
    } else if (this.has('sonOfSon')) {
      if (this.has('daughterOfSon')) {
        this.ashobah['daughterOfSon'] = `bil ghoir`;
      }
      this.ashobah['sonOfSon'] = 'bin nafs';
    } else if (this.has('father')) {
      this.ashobah['father'] = 'bin nafs';
    } else if (this.has('fatherOfFather')) {
      this.ashobah['fatherOfFather'] = 'bin nafs';
    } else if (this.has('brother')) {
      if (this.has('sister')) {
        this.ashobah['sister'] = `bil ghoir`;
      }
      this.ashobah['brother'] = 'bin nafs';
    } else if (this.has('brotherSameFather')) {
      if (this.has('sisterSameFather')) {
        this.ashobah['sisterSameFather'] = 'bin nafs';
      }
      this.ashobah['brotherSameFather'] = 'bin nafs';
    } else if (this.has('sonOfBrother')) {
      this.ashobah['sonOfBrother'] = 'bin nafs';
    } else if (this.has('sister') && this.has('daughter')) {
      this.ashobah['sister'] = `ma'al ghoir`;
    } else if (this.has('sister') && this.has('daughterOfSon')) {
      this.ashobah['sister'] = `ma'al ghoir`;
    } else if (this.has('sonOfBrotherSameFather')) {
      this.ashobah['sonOfBrotherSameFather'] = 'bin nafs';
    } else if (this.has('uncleFromFather')) {
      this.ashobah['uncleFromFather'] = 'bin nafs';
    } else if (this.has('uncleFromSameFather')) {
      this.ashobah['uncleFromSameFather'] = 'bin nafs';
    } else if (this.has('sonOfUncleFromFather')) {
      this.ashobah['sonOfUncleFromFather'] = 'bin nafs';
    } else if (this.has('sonOfUncleFromSameFather')) {
      this.ashobah['sonOfUncleFromSameFather'] = 'bin nafs';
    }
    return this.ashobah;
  }

  calculateAsalMasalah(ashabulFurud) {
    const masalah = [];
    let divident = 0;

    for (let key in ashabulFurud) {
      if (ashabulFurud[key] === '1/2') {
        masalah.push(2);
      } else if (ashabulFurud[key] === '1/4') {
        masalah.push(4);
      } else if (ashabulFurud[key] === '1/8') {
        masalah.push(8);
      } else if (ashabulFurud[key] === '1/12') {
        masalah.push(12);
      } else if (ashabulFurud[key] === '1/3') {
        masalah.push(3);
      } else if (ashabulFurud[key] === '2/3') {
        masalah.push(3);
      } else if (ashabulFurud[key] === '1/6') {
        masalah.push(6);
      }
    }

    let asalmasalah = findLCM(masalah);

    for (let key in ashabulFurud) {
      if (ashabulFurud[key] === '1/2') {
        divident += (1 / 2) * asalmasalah;
      } else if (ashabulFurud[key] === '1/4') {
        divident += (1 / 4) * asalmasalah;
      } else if (ashabulFurud[key] === '1/8') {
        divident += (1 / 8) * asalmasalah;
      } else if (ashabulFurud[key] === '1/12') {
        divident += (1 / 12) * asalmasalah;
      } else if (ashabulFurud[key] === '1/3') {
        divident += (1 / 3) * asalmasalah;
      } else if (ashabulFurud[key] === '2/3') {
        divident += (2 / 3) * asalmasalah;
      } else if (ashabulFurud[key] === '1/6') {
        divident += (1 / 6) * asalmasalah;
      }
    }

    let calculation = '';
    if (this.isUmariyatani()) {
      calculation = 'umariyatani';
    } else if (
      divident < asalmasalah &&
      Object.keys(this.ashobah).length === 0
    ) {
      calculation = 'radd';
    } else if (divident > asalmasalah) {
      calculation = 'aul';
    } else {
      calculation = '-';
    }

    return {
      calculation: calculation,
      asalmasalah: asalmasalah,
      divident: divident
    };
  }

  calculatePortion() {
    let currentBalance = this.balance;
    if (this.isUmariyatani()) {
      if (this.has('wife')) {
        this.portion['wife'] = {
          portion: '1/4',
          from: 'ashabul furudh',
          value: currentBalance / 4,
          valuePerPerson: currentBalance / 4 / this.ahliWaris['wife']
        };

        currentBalance -= this.portion['wife'].value;

        this.portion['mother'] = {
          portion: '1/3 residual',
          from: 'ashabul furudh',
          value: currentBalance / 3,
          valuePerPerson: currentBalance / 3
        };

        currentBalance -= this.portion['mother'].value;

        this.portion['father'] = {
          portion: '2/3 residual',
          from: 'ashobah',
          value: currentBalance,
          valuePerPerson: currentBalance
        };
      } else if (this.has('husband')) {
        this.portion['husband'] = {
          portion: '1/2',
          from: 'ashabul furudh',
          value: currentBalance / 2,
          valuePerPerson: currentBalance / 2
        };
        currentBalance -= this.portion['husband'].value;

        this.portion['mother'] = {
          portion: '1/3 residual',
          from: 'ashabul furudh',
          value: currentBalance / 3,
          valuePerPerson: currentBalance / 3
        };

        currentBalance -= this.portion['mother'].value;

        this.portion['father'] = {
          portion: '1/3 residual',
          from: 'ashabul furudh',
          value: currentBalance / 3,
          valuePerPerson: currentBalance / 3
        };
      }
    } else if (this.calculation == '-') {
      for (let key in this.ashabulFurud) {
        let value = 0;
        if (this.ashabulFurud[key] === '1/2') {
          value = (1 / 2) * this.balance;
        } else if (this.ashabulFurud[key] === '1/4') {
          value = (1 / 4) * this.balance;
        } else if (this.ashabulFurud[key] === '1/8') {
          value = (1 / 8) * this.balance;
        } else if (this.ashabulFurud[key] === '1/12') {
          value = (1 / 12) * this.balance;
        } else if (this.ashabulFurud[key] === '1/3') {
          value = (1 / 3) * this.balance;
        } else if (this.ashabulFurud[key] === '2/3') {
          value = (2 / 3) * this.balance;
        } else if (this.ashabulFurud[key] === '1/6') {
          value = (1 / 6) * this.balance;
        }

        if (key === 'siblingSameMother') {
          this.portion['sisterSameMother'] = {
            portion: this.ashabulFurud[key],
            from: 'ashabul furudh',
            value:
              (value /
                (this.ahliWaris['sisterSameMother'] +
                  this.ahliWaris['brotherSameMother'])) *
              this.ahliWaris['sisterSameMother'],
            valuePerPerson:
              value /
              (this.ahliWaris['sisterSameMother'] +
                this.ahliWaris['brotherSameMother'])
          };

          this.portion['brotherSameMother'] = {
            portion: this.ashabulFurud[key],
            from: 'ashabul furudh',
            value:
              (value /
                (this.ahliWaris['sisterSameMother'] +
                  this.ahliWaris['brotherSameMother'])) *
              this.ahliWaris['brotherSameMother'],
            valuePerPerson:
              value /
              (this.ahliWaris['sisterSameMother'] +
                this.ahliWaris['brotherSameMother'])
          };
        } else {
          this.portion[key] = {
            portion: this.ashabulFurud[key],
            from: 'ashabul furudh',
            value: value,
            valuePerPerson: value / this.ahliWaris[key]
          };
        }

        currentBalance -= value;
      }

      if (Object.keys(this.ashobah).length == 1) {
        this.portion[Object.keys(this.ashobah)[0]] = {
          portion: this.asalmasalah - this.divident + '/' + this.asalmasalah,
          from: 'ashobah ' + this.ashobah[Object.keys(this.ashobah)[0]],
          value: currentBalance,
          valuePerPerson:
            currentBalance / this.ahliWaris[Object.keys(this.ashobah)[0]]
        };
      } else if (Object.keys(this.ashobah).length > 1) {
        ashobahDivident = 0;
        for (key in this.ashobah) {
          if (this.male.indexOf(key) >= 0) {
            ashobahDivident += 2 * this.ahliWaris[key];
          }
          if (this.female.indexOf(key) >= 0) {
            ashobahDivident += this.ahliWaris[key];
          }
        }

        for (key in this.ashobah) {
          if (this.male.indexOf(key) >= 0) {
            this.portion[key] = {
              portion:
                (this.asalmasalah - this.divident) * (2 * this.ahliWaris[key]) +
                '/' +
                this.asalmasalah * ashobahDivident,
              from: 'ashobah ' + this.ashobah[key],
              value:
                ((2 * this.ahliWaris[key]) / ashobahDivident) * currentBalance,
              valuePerPerson:
                (((2 * this.ahliWaris[key]) / ashobahDivident) *
                  currentBalance) /
                this.ahliWaris[key]
            };
          }

          if (this.female.indexOf(key) >= 0) {
            this.portion[key] = {
              portion:
                (this.asalmasalah - this.divident) * this.ahliWaris[key] +
                '/' +
                this.asalmasalah * ashobahDivident,
              from: 'ashobah ' + this.ashobah[key],
              value: (this.ahliWaris[key] / ashobahDivident) * currentBalance,
              valuePerPerson:
                ((this.ahliWaris[key] / ashobahDivident) * currentBalance) /
                this.ahliWaris[key]
            };
          }
        }
      }
    } else if (this.calculation == 'aul') {
      for (key in this.ashabulFurud) {
        value = 0;
        divident = 0;
        if (this.ashabulFurud[key] === '1/2') {
          divident = (1 / 2) * this.asalmasalah;
        } else if (this.ashabulFurud[key] === '1/4') {
          divident = (1 / 4) * this.asalmasalah;
        } else if (this.ashabulFurud[key] === '1/8') {
          divident = (1 / 8) * this.asalmasalah;
        } else if (this.ashabulFurud[key] === '1/12') {
          divident = (1 / 12) * this.asalmasalah;
        } else if (this.ashabulFurud[key] === '1/3') {
          divident = (1 / 3) * this.asalmasalah;
        } else if (this.ashabulFurud[key] === '2/3') {
          divident = (2 / 3) * this.asalmasalah;
        } else if (this.ashabulFurud[key] === '1/6') {
          divident = (1 / 6) * this.asalmasalah;
        }

        value = (divident / this.divident) * this.balance;

        if (key === 'siblingSameMother') {
          this.portion['sisterSameMother'] = {
            portion:
              divident * this.ahliWaris['sisterSameMother'] +
              '/' +
              this.divident *
                (this.ahliWaris['sisterSameMother'] +
                  this.ahliWaris['brotherSameMother']),
            from: 'ashabul furudh',
            value:
              (value /
                (this.ahliWaris['sisterSameMother'] +
                  this.ahliWaris['brotherSameMother'])) *
              this.ahliWaris['sisterSameMother'],
            valuePerPerson:
              value /
              (this.ahliWaris['sisterSameMother'] +
                this.ahliWaris['brotherSameMother'])
          };

          this.portion['brotherSameMother'] = {
            portion:
              divident * this.ahliWaris['brotherSameMother'] +
              '/' +
              this.divident *
                (this.ahliWaris['sisterSameMother'] +
                  this.ahliWaris['brotherSameMother']),
            from: 'ashabul furudh',
            value:
              (value /
                (this.ahliWaris['sisterSameMother'] +
                  this.ahliWaris['brotherSameMother'])) *
              this.ahliWaris['brotherSameMother'],
            valuePerPerson:
              value /
              (this.ahliWaris['sisterSameMother'] +
                this.ahliWaris['brotherSameMother'])
          };
        } else {
          this.portion[key] = {
            portion: divident + '/' + this.divident,
            from: 'ashabul furudh',
            value: value,
            valuePerPerson: value / this.ahliWaris[key]
          };
        }
      }
    } else if (this.calculation == 'radd') {
      const restAshabulFurudh = JSON.parse(JSON.stringify(this.ashabulFurud));
      if (this.has('husband')) {
        value =
          this.ashabulFurud['husband'] === '1/2'
            ? (1 / 2) * this.balance
            : (1 / 4) * this.balance;

        this.portion['husband'] = {
          portion: this.ashabulFurud['husband'],
          from: 'ashabul furudh',
          value: value,
          valuePerPerson: value / this.ahliWaris['husband']
        };
        currentBalance -= value;
        delete restAshabulFurudh.husband;
      }

      if (this.has('wife')) {
        value =
          this.ashabulFurud['wife'] === '1/4'
            ? (1 / 4) * this.balance
            : (1 / 8) * this.balance;

        this.portion['wife'] = {
          portion: this.ashabulFurud['wife'],
          from: 'ashabul furudh',
          value: value,
          valuePerPerson: value / this.ahliWaris['wife']
        };
        currentBalance -= value;
        delete restAshabulFurudh.wife;
      }

      let calculate = this.calculateAsalMasalah(restAshabulFurudh);

      for (key in restAshabulFurudh) {
        value = 0;
        divident = 0;
        if (restAshabulFurudh[key] === '1/2') {
          divident = (1 / 2) * calculate.asalmasalah;
        } else if (restAshabulFurudh[key] === '1/4') {
          divident = (1 / 4) * calculate.asalmasalah;
        } else if (restAshabulFurudh[key] === '1/8') {
          divident = (1 / 8) * calculate.asalmasalah;
        } else if (restAshabulFurudh[key] === '1/12') {
          divident = (1 / 12) * calculate.asalmasalah;
        } else if (restAshabulFurudh[key] === '1/3') {
          divident = (1 / 3) * calculate.asalmasalah;
        } else if (restAshabulFurudh[key] === '2/3') {
          divident = (2 / 3) * calculate.asalmasalah;
        } else if (restAshabulFurudh[key] === '1/6') {
          divident = (1 / 6) * calculate.asalmasalah;
        }

        value = (divident / calculate.divident) * currentBalance;

        if (key === 'siblingSameMother') {
          let gcdSister = findGCD(
            this.ahliWaris['sisterSameMother'] +
              this.ahliWaris['brotherSameMother'],
            this.ahliWaris['sisterSameMother']
          );

          let gcdBrother = findGCD(
            this.ahliWaris['sisterSameMother'] +
              this.ahliWaris['brotherSameMother'],
            this.ahliWaris['brotherSameMother']
          );

          this.portion['sisterSameMother'] = {
            portion:
              (divident * this.ahliWaris['sisterSameMother']) / gcdSister +
              '/' +
              calculate.divident *
                ((this.ahliWaris['sisterSameMother'] +
                  this.ahliWaris['brotherSameMother']) /
                  gcdSister) +
              (this.has('wife') ? ' sisa' : ''),
            from: 'ashabul furudh',
            value:
              (value /
                (this.ahliWaris['sisterSameMother'] +
                  this.ahliWaris['brotherSameMother'])) *
              this.ahliWaris['sisterSameMother'],
            valuePerPerson:
              value /
              (this.ahliWaris['sisterSameMother'] +
                this.ahliWaris['brotherSameMother'])
          };

          this.portion['brotherSameMother'] = {
            portion:
              (divident * this.ahliWaris['brotherSameMother']) / gcdBrother +
              '/' +
              calculate.divident *
                ((this.ahliWaris['sisterSameMother'] +
                  this.ahliWaris['brotherSameMother']) /
                  gcdBrother) +
              (this.has('wife') ? ' sisa' : ''),
            from: 'ashabul furudh',
            value:
              (value /
                (this.ahliWaris['sisterSameMother'] +
                  this.ahliWaris['brotherSameMother'])) *
              this.ahliWaris['brotherSameMother'],
            valuePerPerson:
              value /
              (this.ahliWaris['sisterSameMother'] +
                this.ahliWaris['brotherSameMother'])
          };
        } else {
          this.portion[key] = {
            portion:
              divident +
              '/' +
              calculate.divident +
              (this.has('wife') ? ' sisa' : ''),
            from: 'ashabul furudh',
            value: value,
            valuePerPerson: value / this.ahliWaris[key]
          };
        }

        currentBalance -= value;
      }
    }
  }

  calculateWaris() {
    this.validateAsset();
    this.validateAhliWaris();
    this.calculateAshabulFurudh();
    this.chooseAsobah();
    let calculate = this.calculateAsalMasalah(this.ashabulFurud);
    this.asalmasalah = calculate.asalmasalah;
    this.calculation = calculate.calculation;
    this.divident = calculate.divident;
    this.calculatePortion();

    if (Object.keys(this.errorMessage).length > 0) return this.errorMessage;
    else return { portion: this.portion, calculation: this.calculation };
  }
}

module.exports = Waris;
