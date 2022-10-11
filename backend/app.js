const https = require('https');

class Food {
    constructor(n, energy, carbs, protein, fat) {
        this.name = n
        this.health = energy
        this.attack = carbs
        this.defence = protein
        this.delay = carbs + protein + fat
        this.internalTime = 0
    }

    getName() { return this.name }
    getHealth() { return this.health }
    getAttack() { return this.attack }
    getDefence() { return this.defence }
    getDelay() { return this.delay }
    getInternalTime() { return this.internalTime }

    increaseInternalTime() { this.internalTime += this.delay }
    receiveDamage(damage) {
        this.health -= damage
    }

    static attack(attacker, defensor) {
        let dmg = (attacker.getAttack() * (100 - defensor.getDefence())) / 100
        defensor.receiveDamage(dmg)
        return dmg
    }
}

//porkkana = 300
//paprika = 355
//funktio joka vastaanottaa ruoan id:n ja palauttaa tiedot array
//test/cleanup here
function getFoodData(id) {
    return new Promise((resolve, reject) => {
        let url = 'https://fineli.fi/fineli/api/v1/foods/' + id
        https.get(url, res => {
            let data = [];
            const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
            console.log('Status Code:', res.statusCode);
            console.log('Date in Response header:', headerDate);

            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {
                console.log('Response ended: ');
                const parsedData = JSON.parse(Buffer.concat(data).toString());

                resolve ([parsedData.name.fi,
                    parsedData.energy,
                    parsedData.carbohydrate,
                    parsedData.protein,
                    parsedData.fat])
            });
        }).on('error', err => {
            console.log('Error: ', err.message);
        });
    }
    )
}

const fight = (fighterA, fighterB) => {
    console.log("Taistelu alkaa")
    fighterA.increaseInternalTime()
    fighterB.increaseInternalTime()

    while (fighterA.getHealth() > 0 && fighterB.getHealth() > 0) {
        let attacker
        let defensor
        if (fighterA.getInternalTime() < fighterB.getInternalTime()) {
            attacker = fighterA
            defensor = fighterB
        } else {
            attacker = fighterB
            defensor = fighterA
        }
        let dmg = Food.attack(attacker, defensor)
        console.log("dmg: ", dmg)
        console.log(attacker.getInternalTime(), " s")
        console.log(attacker.getName(), " lyö ja tekee ", dmg, " vahinkoa.")
        console.log(defensor.getName() + "lle jäi ", defensor.getHealth(), " Health")
        attacker.increaseInternalTime()
    }

    let winner
    if (fighterA.getHealth() < 0) {
        winner = fighterB
    } else {
        winner = fighterA
    }
    console.log(winner.getName(), "voitti taistelun!")
}

async function initFoods() {
    const dataA = await getFoodData(300)
    const dataB = await getFoodData(355)
    console.log(dataA[0], dataA[1], dataA[2], dataA[3], dataA[4])
    let foodA = new Food(dataA[0], dataA[1], dataA[2], dataA[3], dataA[4])
    let foodB = new Food(dataB[0], dataB[1], dataB[2], dataB[3], dataB[4])
    console.log(foodA.getAttack,foodA.getDefence,foodA.getName)
    fight(foodA, foodB)
}

initFoods()