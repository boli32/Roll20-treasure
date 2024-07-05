

var Treasure = Treasure || (function() {
    'use strict';

    
    let properties = {
        0: 'None',
        1: 'Random',
        2: 'Coin',
        3: 'Treasure',
        4: 'Potion',
        5: 'Health Potion',
        6: 'Equipment',
        7: 'Junk',
        8: 'SpellBook',
        9: 'Scroll',
        10: 'Magic Item',
        11: 'Selected Weapon',
        12: 'Random Weapon',
        13: 'Selected Armour',
        14: 'Random Armour',
        15: 'Selected Trinket',
        16: 'Random Trinket'
    };
    let crRating = {
        0: '1-4',
        1: '5-8',
        2: '9-12',
        3: '13-16',
        4: '17-20'
    };
    let weaponTypes = {
        0: 'Club',
        1: 'Dagger',
        2: 'Greatclub',
        3: 'Handaxe',
        4: 'Javelin',
        5: 'Light Hammer',
        6: 'Mace',
        7: 'Quarterstaff',
        8: 'Sickle',
        9: 'Spear',
        10: 'Light Crossbow',
        11: 'Dart',
        12: 'Battleaxe',
        13: 'Flail',
        14: 'Glaive',
        15: 'Greataxe',
        16: 'Greatsword',
        17: 'Halberd',
        18: 'Lance',
        19: 'Longsword',
        20: 'Maul',
        21: 'Morningstar',
        22: 'Pike',
        23: 'Rapier',
        24: 'Scimitar',
        25: 'Shortsword',
        26: 'Trident',
        27: 'War Pick',
        28: 'Warhammer',
        29: 'Whip',
        30: 'Blowgun',
        31: 'Hand Crossbow',
        32: 'Heavy Crossbow',
        33: 'Longbow',
        34: 'Net'
    };
    let trinketTypes = {
        0: 'Gauntlets',
        1: 'Pendant',
        2: 'Cloak',
        3: 'Belt',
        4: 'Amulet',
        5: 'Quiver',
        6: 'Helm',
        7: 'Cap',
        8: 'Wizard Hat',
        9: 'Boots',
        10: 'Circlet',
        11: 'Medallion',
        12: 'Mask',
        13: 'Collar',
        14: 'Ring',
        15: 'Scabbard',
        16: 'Bracers',
        17: 'Tiara',
        18: 'Gloves',
        19: 'Orb'
    };
    let armourTypes = {
        0: 'Padded',
        1: 'Leather',
        2: 'Studded Leather',
        3: 'Hide',
        4: 'Chain Shirt',
        5: 'Scale Mail',
        6: 'Breastplate',
        7: 'Half Plate',
        8: 'Ring Mail',
        9: 'Chain Mail',
        10: 'Splint',
        11: 'Plate'
    };

    registerEventHandlers = () => {
        on('chat:message', handleInput);
    },
    handleInput = (msg) => {
        if (msg.type != 'api') return;

        let args = msg.content.split(' ');
        let command = args.shift().substring(1);
        let extracommand = args.shift();

        if (command == "treasure") {
            switch(extracommand) {
                case 'config': {
                    if (args.length > 0) {
                        let setting = args.shift().split('|');
                        let key = setting.shift();
                        let value = (setting[0] === 'true') ? true : (setting[0] === 'false') ? false : setting[0];
                        state.TREASURE.config[key] = value;
                        sendChat('Treasure', '!treasure config', null, {noarchive:true});
                    }
                    else {
                        let content = ""
                        content += makeTitle("Party Tier")
                        content += makeButton(crRating[state.TREASURE.config.cr],"!treasure config cr|" + makeQuery(crRating, "Choose Party Level"))
                        content += "<br><hr>"
                        content += makeTitle("Choose Loot")
                        content += makeLoot()                
                        content += "<br><hr>"
                        content += makeButton("Reset","!treasure reset")
                        content += "<br><hr>"
                        content += makeButton("Run Macro","!treasure")
                        configMenu(content, "Treasure Config")
                    }
                }
                break;
                case 'reset': {
                    setDefaults();
                    sendChat('Treasure', '!treasure config', null, {noarchive:true});
                }
                break;
                default:
                    let content = ""
                    let lootname1 = 0
                    let lootname2 = 0
                    let lootname3 = 0
                    let lootname4 = 0

                    if (state.TREASURE.config.propertyFirst == 0
                        && state.TREASURE.config.propertySecond == 0
                        && state.TREASURE.config.propertyThird == 0
                        && state.TREASURE.config.propertyFourth == 0 ) {
                        content += 'nothing but hopes and dreams'
                    }
                    else {
                        if (state.TREASURE.config.propertyFirst != 0) {
                            content += makeSwitch(state.TREASURE.config.propertyFirst,state.TREASURE.config.lootNameFirst);
                        }
                        if (state.TREASURE.config.propertySecond != 0) {
                            content += "%NEWLINE%";
                            content += makeSwitch(state.TREASURE.config.propertySecond,state.TREASURE.config.lootNameSecond);
                        }
                        if (state.TREASURE.config.propertyThird != 0) {
                            content += "%NEWLINE%";
                            content += makeSwitch(state.TREASURE.config.propertyThird,state.TREASURE.config.lootNameThird);
                        }
                        if (state.TREASURE.config.propertyFourth != 0) {
                            content += "%NEWLINE%";
                            content += makeSwitch(state.TREASURE.config.propertyFourth,state.TREASURE.config.lootNameFourth);
                        }
                    }
                    sendChat('Treasure', '!rt[Delimiter:BR] &{template:npcaction} {{rname=Treasure}} {{name=Cross your fingers and trust in Tymora}}{{description=' + content + '}}', null, {noarchive:true});
                break;
            }
        }
        else return;
    },
    configMenu = (contents, title) => {
        title = (title && title != '') ? makeTitle(title) : '';
        sendChat('Treasure', '/w gm <div style="background-color: #fff; border: 1px solid #000; padding: 5px; border-radius: 5px;overflow: hidden;">'+title+contents+'</div>', null, {noarchive:true});
    },

    makeTitle = (title) => {
        return '<h4 style="margin-bottom: 10px;">'+title+'</h4>';
    },

    makeButton = (title, href) => {
        return '<a style="background-color: #000; border: 1px solid #292929 ; border-radius: 3px ; padding: 5px ; color: #fff ; text-align: center ; width: 100%; display: inline-block;" href="'+href+'">'+title+'</a>';
    },

    makeLoot = () => {
        let lootContent = ""
        lootContent += '1<div style="padding: 5px 20px 5px 50px; border-radius: 5px; border: 1px solid #000;">' + makeButton(properties[state.TREASURE.config.propertyFirst],"!treasure config propertyFirst|" + makeQuery(properties, "Choose Loot"))
        if (state.TREASURE.config.propertyFirst == 11) {
            lootContent += makeButton(weaponTypes[state.TREASURE.config.lootNameFirst],"!treasure config lootNameFirst|" + makeQuery(weaponTypes, "Choose Weapon"))
        }
        if (state.TREASURE.config.propertyFirst == 13) {
            lootContent += makeButton(armourTypes[state.TREASURE.config.lootNameFirst],"!treasure config lootNameFirst|" + makeQuery(armourTypes, "Choose Armour"))
        }
        if (state.TREASURE.config.propertyFirst == 15) {
            lootContent += makeButton(trinketTypes[state.TREASURE.config.lootNameFirst],"!treasure config lootNameFirst|" + makeQuery(trinketTypes, "Choose Trinket"))
        }
        lootContent += '</div>2<div style="padding: 5px 20px 5px 50px; border-radius: 5px; border: 1px solid #000;">' + makeButton(properties[state.TREASURE.config.propertySecond],"!treasure config propertySecond|" + makeQuery(properties, "Choose Loot"))
        if (state.TREASURE.config.propertySecond == 11) {
            lootContent += makeButton(weaponTypes[state.TREASURE.config.lootNameSecond],"!treasure config lootNameSecond|" + makeQuery(weaponTypes, "Choose Weapon"))
        }
        if (state.TREASURE.config.propertySecond == 13) {
            lootContent += makeButton(armourTypes[state.TREASURE.config.lootNameSecond],"!treasure config lootNameSecond|" + makeQuery(armourTypes, "Choose Armour"))
        }
        if (state.TREASURE.config.propertySecond == 15) {
            lootContent += makeButton(trinketTypes[state.TREASURE.config.lootNameSecond],"!treasure config lootNameSecond|" + makeQuery(trinketTypes, "Choose Trinket"))
        }
        lootContent += '</div>3<div style="padding: 5px 20px 5px 50px; border-radius: 5px; border: 1px solid #000;">' + makeButton(properties[state.TREASURE.config.propertyThird],"!treasure config propertyThird|" + makeQuery(properties, "Choose Loot"))
        if (state.TREASURE.config.propertyThird == 11) {
            lootContent += makeButton(weaponTypes[state.TREASURE.config.lootNameThird],"!treasure config lootNameThird|" + makeQuery(weaponTypes, "Choose Weapon"))
        }
        if (state.TREASURE.config.propertyThird == 13) {
            lootContent += makeButton(armourTypes[state.TREASURE.config.lootNameThird],"!treasure config lootNameThird|" + makeQuery(armourTypes, "Choose Armour"))
        }
        if (state.TREASURE.config.propertyThird == 15) {
            lootContent += makeButton(trinketTypes[state.TREASURE.config.lootNameThird],"!treasure config lootNameThird|" + makeQuery(trinketTypes, "Choose Trinket"))
        }
        lootContent += '</div>4<div style="padding: 5px 20px 5px 50px; border-radius: 5px; border: 1px solid #000;">' + makeButton(properties[state.TREASURE.config.propertyFourth],"!treasure config propertyFourth|" + makeQuery(properties, "Choose Loot"))
        if (state.TREASURE.config.propertyFourth == 11) {
            lootContent += makeButton(weaponTypes[state.TREASURE.config.lootNameFourth],"!treasure config lootNameFourth|" + makeQuery(weaponTypes, "Choose Weapon"))
        }
        if (state.TREASURE.config.propertyFourth == 13) {
            lootContent += makeButton(armourTypes[state.TREASURE.config.lootNameFourth],"!treasure config lootNameFourth|" + makeQuery(armourTypes, "Choose Armour"))
        }
        if (state.TREASURE.config.propertyFourth == 15) {
            lootContent += makeButton(trinketTypes[state.TREASURE.config.lootNameFourth],"!treasure config lootNameFourth|" + makeQuery(trinketTypes, "Choose Trinket"))
        }
        lootContent += '</div>'
        return lootContent;                

    },
    makeQuery = (v,t) => {
        let query = "?{" + t
        for (var k in v){
            if (typeof v[k] !== 'function') {
                query += "|" + v[k] + "," + k
            }
        }
        query += "}"
        return query;
    },
    makeSwitch = (switchVar, lootName) => {
        var switchContent = '';
        if (switchVar == 0) {
            switchContent += '<nothing>';
        }
        if (switchVar == 1) {
            if (state.TREASURE.config.cr == 0) switchContent += '[[1t[CR-1-4]]]';
            if (state.TREASURE.config.cr == 1) switchContent += '[[1t[CR-5-8]]]';
            if (state.TREASURE.config.cr == 2) switchContent += '[[1t[CR-9-12]]]';
            if (state.TREASURE.config.cr == 3) switchContent += '[[1t[CR-13-16]]]';
            if (state.TREASURE.config.cr == 4) switchContent += '[[1t[CR-17-20]]]';
        }
        if (switchVar == 2) {
            if (state.TREASURE.config.cr == 0) switchContent += 'A purse containing: [[2d20]]cp [[1d10]]sp [[1d6]]ep [[1d3]]gp';
            if (state.TREASURE.config.cr == 1) switchContent += 'A small sack containing: [[4d20]]cp [[2d10]]sp [[2d6]]ep [[2d3]]gp';
            if (state.TREASURE.config.cr == 2) switchContent += 'A backpack containing: [[6d20]]cp [[3d10]]sp [[3d6]]ep [[3d3]]gp [[1d2]]pp';
            if (state.TREASURE.config.cr == 3) switchContent += 'A small chest containing: [[8d20]]cp [[4d10]]sp [[4d6]]ep [[4d3]]gp [[2d2]]pp';
            if (state.TREASURE.config.cr == 4) switchContent += 'A chest containing: [[10d20]]cp [[5d10]]sp [[5d6]]ep [[5d3]]gp [[3d2]]pp';
        }
        if (switchVar == 3) {
            if (state.TREASURE.config.cr == 0) switchContent += '[[1t[treasure-CR1-4]]]';
            if (state.TREASURE.config.cr == 1) switchContent += '[[1t[treasure-CR5-8]]]';
            if (state.TREASURE.config.cr == 2) switchContent += '[[1t[treasure-CR9-12]]]';
            if (state.TREASURE.config.cr == 3) switchContent += '[[1t[treasure-CR13-16]]]';
            if (state.TREASURE.config.cr == 4) switchContent += '[[1t[treasure-CR17-20]]]';
        }
        if (switchVar == 4) {
            switchContent += '[[1t[potions]]]';
        }
        if (switchVar == 5) {
            switchContent += '[[1t[potion-healing]]]';
        }
        if (switchVar == 6) {
            switchContent += '[[1t[equipment]]]';
        }
        if (switchVar == 7) {
            switchContent += '[[1t[Junk]]]';
        }
        if (switchVar == 8) {
            if (state.TREASURE.config.cr == 0) switchContent += '[[1t[spellbooks-CR1-4]]]';
            if (state.TREASURE.config.cr == 1) switchContent += '[[1t[spellbooks-CR5-8]]]';
            if (state.TREASURE.config.cr == 2) switchContent += '[[1t[spellbooks-CR9-12]]]';
            if (state.TREASURE.config.cr == 3) switchContent += '[[1t[spellbooks-CR13-16]]]';
            if (state.TREASURE.config.cr == 4) switchContent += '[[1t[spellbooks-CR17-20]]]';
        }
        if (switchVar == 9) {
            if (state.TREASURE.config.cr == 0) switchContent += '[[1t[scrolls-CR1-4]]]';
            if (state.TREASURE.config.cr == 1) switchContent += '[[1t[scrolls-CR5-8]]]';
            if (state.TREASURE.config.cr == 2) switchContent += '[[1t[scrolls-CR9-12]]]';
            if (state.TREASURE.config.cr == 3) switchContent += '[[1t[scrolls-CR13-16]]]';
            if (state.TREASURE.config.cr == 4) switchContent += '[[1t[scrolls-CR17-20]]]';
        }
        if (switchVar == 10) {
            if (state.TREASURE.config.cr == 0) switchContent += '[[1t[magic-items-CR1-4]]]';
            if (state.TREASURE.config.cr == 1) switchContent += '[[1t[magic-items-CR5-8]]]';
            if (state.TREASURE.config.cr == 2) switchContent += '[[1t[magic-items-CR9-12]]]';
            if (state.TREASURE.config.cr == 3) switchContent += '[[1t[magic-items-CR13-16]]]';
            if (state.TREASURE.config.cr == 4) switchContent += '[[1t[magic-items-CR17-20]]]';
        }
        if (switchVar == 11) {
            switchContent += weaponTypes[lootName] + ' [[1t[Weapon-Effect]]]';
        }
        if (switchVar == 12) {
            switchContent += '[[1t[minor-weapon]]]';
        }
        if (switchVar == 13) {
            switchContent += armourTypes[lootName] + ' [[1t[Armour-Effect]]]';
        }
        if (switchVar == 14) {
            switchContent += '[[1t[minor-armour]]]';
        }
        if (switchVar == 15) {
            switchContent += trinketTypes[lootName] + ' [[1t[Trinket-Effect]]]';
        }
        if (switchVar == 16) {
            switchContent += '[[1t[minor-trinket]]]';
        }
        return switchContent;
    },
    setDefaults = (reset) => {
        const defaults = {
            config: {
                cr:  0,
                propertyFirst: 1,
                propertySecond: 6,
                propertyThird: 7,
                propertyFourth: 2,
                lootNameFirst: 0,
                lootNameSecond: 0,
                lootNameThird: 0,
                lootNameFourth: 0,
            }
        }
        state.TREASURE.config.cr = defaults.config.cr;
        state.TREASURE.config.propertyFirst = defaults.config.propertyFirst;
        state.TREASURE.config.propertySecond = defaults.config.propertySecond;
        state.TREASURE.config.propertyThird = defaults.config.propertyThird;
        state.TREASURE.config.propertyFourth = defaults.config.propertyFourth;
        state.TREASURE.config.lootNameFirst = defaults.config.lootNameFirst;
        state.TREASURE.config.lootNameSecond = defaults.config.lootNameSecond;
        state.TREASURE.config.lootNameThird = defaults.config.lootNameThird;
        state.TREASURE.config.lootNameFourth = defaults.config.lootNameFourth;
        
    };
    return {
        RegisterEventHandlers: registerEventHandlers
    };
})();

on('ready',function() {
    'use strict';

    Treasure.RegisterEventHandlers();

    if( ! state.TREASURE ) {
        state.TREASURE = {
            config: {
                version: 1.0
            }
        };
    }


});