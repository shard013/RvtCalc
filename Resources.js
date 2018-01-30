var Resources = {

    //Extracted
    RawWood: {
        Name: "Raw Wood",
        Produced: 1,
        ApproxMaxLevel: 3200,
        Required: {}
    },
    CopperOre: {
        Name: "Copper Ore",
        Produced: 2,
        ApproxMaxLevel: 1500,
        Required: {}
    },
    Coal: {
        Name: "Coal",
        Produced: 2,
        ApproxMaxLevel: 3000,
        Required: {}
    },
    Water: {
        Name: "Water",
        Produced: 8,
        ApproxMaxLevel: 3000,
        Required: {}
    },
    Limestone: {
        Name: "Limestone",
        Produced: 2,
        ApproxMaxLevel: 1500,
        Required: {}
    },
    TinOre: {
        Name: "Tin Ore",
        Produced: 2,
        ApproxMaxLevel: 1000,
        Required: {}
    },
    Sulfur: {
        Name: "Sulfur",
        Produced: 2,
        ApproxMaxLevel: 400,
        Required: {}
    },
    IronOre: {
        Name: "Iron Ore",
        Produced: 4,
        ApproxMaxLevel: 900,
        Required: {}
    },
    CrudeOil: {
        Name: "Crude Oil",
        Produced: 100,
        ApproxMaxLevel: 250,
        Required: {}
    },
    Quartz: {
        Name: "Quartz",
        Produced: 1,
        ApproxMaxLevel: 750,
        Required: {}
    },
    GalenaOre: {
        Name: "Galena Ore",
        Produced: 4,
        ApproxMaxLevel: 250,
        Required: {}
    },
    Gold: {
        Name: "Gold",
        Produced: 100,
        ApproxMaxLevel: 50,
        Required: {}
    },

    //Built Basic Circuit Board
    Wood: {
        Name: "Wood",
        Produced: 1,
        Required: {
            RawWood: 4
        }
    },
    WoodPlanks: {
        Name: "Wood Planks",
        Produced: 1,
        Required: {
            Wood: 4
        }
    },
    Carbon: {
        Name: "Carbon",
        Produced: 2,
        Required: {
            Water: 4,
            Coal: 2
        }
    },
    CopperPlates: {
        Name: "Copper Plates",
        Produced: 1,
        Required: {
            CopperOre: 20,
            Carbon: 10
        }
    },
    CopperWire: {
        Name: "Copper Wire",
        Produced: 2,
        Required: {
            CopperPlates: 6
        }
    },
    BasicCircuitBoard: {
        Name: "Basic Circuit Board",
        Produced: 1,
        Required: {
            WoodPlanks: 20,
            CopperWire: 8
        }
    },

    //Built Basic Electronic Components
    Silicone: {
        Name: "Silicone",
        Produced: 3,
        Required: {
            Quartz: 20,
            Carbon: 10
        }
    },
    Hydrogen: {
        Name: "Hydrogen",
        Produced: 10,
        Required: {
            Water: 30
        }
    },
    Chloride: {
        Name: "Chloride",
        Produced: 8,
        Required: {
            Water: 40
        }
    },
    HydrogenChloride: {
        Name: "Hydrogen Chloride",
        Produced: 2,
        Required: {
            Hydrogen: 20,
            Chloride: 16
        }
    },
    CalciumChloride: {
        Name: "Calcium Chloride",
        Produced: 1,
        Required: {
            HydrogenChloride: 2,
            Limestone: 4
        }
    },
    TinPlates: {
        Name: "Tin Plates",
        Produced: 1,
        Required: {
            TinOre: 20,
            CalciumChloride: 2
        }
    },
    TinnedCopperWire: {
        Name: "Tinned Copper Wire",
        Produced: 1,
        Required: {
            TinPlates: 2,
            CopperPlates: 32
        }
    },
    BasicElectronicComponents: {
        Name: "Basic Electronic Components",
        Produced: 1,
        Required: {
            Silicone: 80,
            TinnedCopperWire: 2
        }
    },

    //Circuit Board
    IronChloride: {
        Name: "Iron Chloride",
        Produced: 4,
        Required: {
            HydrogenChloride: 20,
            IronOre: 20
        }
    },
    CircuitPanels: {
        Name: "Circuit Panels",
        Produced: 1,
        Required: {
            TinPlates: 40,
            CopperPlates: 50
        }
    },
    CircuitBoard: {
        Name: "Circuit Board",
        Produced: 1,
        Required: {
            CircuitPanels: 1,
            IronChloride: 10
        }
    },

    //Rocket Hydrogen Tank
    IronPlates: {
        Name: "Iron Plates",
        Produced: 4,
        Required: {
            IronOre: 40,
            Carbon: 80
        }
    },
    SteelPlates: {
        Name: "Steel Plates",
        Produced: 1,
        Required: {
            IronPlates: 8,
            Silicone: 80
        }
    },
    RocketHydrogenTank: {
        Name: "Rocket Hydrogen Tank",
        Produced: 1,
        Required: {
            SteelPlates: 50,
            Hydrogen: 10000
        }
    },

    //F1 Rocket Engine
    LeadPlates: {
        Name: "Lead Plates",
        Produced: 1,
        Required: {
            GalenaOre: 8,
            Limestone: 600
        }
    },
    SulfuricAcid: {
        Name: "Sulfuric Acid",
        Produced: 1,
        Required: {
            Water: 1000,
            Sulfur: 6
        }
    },
    Kerosine: {
        Name: "Kerosine",
        Produced: 1,
        Required: {
            CrudeOil: 100,
            Carbon: 200
        }
    },
    LeadAcidBattery: {
        Name: "Lead Acid Battery",
        Produced: 1,
        Required: {
            SulfuricAcid: 24,
            LeadPlates: 12
        }
    },
    R1RocketFuel: {
        Name: "R1 Rocket Fuel",
        Produced: 1,
        Required: {
            Kerosine: 50,
            Water: 10000
        }
    },
    F1RocketEngine: {
        Name: "F1 Rocket Engine",
        Produced: 1,
        Required: {
            LeadAcidBattery: 50,
            R1RocketFuel: 12
        }
    },

    //Cockpit
    BasicElectronicBoard: {
        Name: "Basic Electronic Board",
        Produced: 10,
        Required: {
            BasicElectronicComponents: 1000,
            BasicCircuitBoard: 1500
        }
    },
    Cockpit: {
        Name: "Cockpit",
        Produced: 1,
        Required: {
            LeadPlates: 500,
            BasicElectronicBoard: 100
        }
    },

    //Colonist Pod
    GoldFoil: {
        Name: "Gold Foil",
        Produced: 1,
        Required: {
            Gold: 100,
            Carbon: 500
        }
    },
    ElectronicCircuitBoard: {
        Name: "Electronic Circuit Board",
        Produced: 10,
        Required: {
            BasicElectronicComponents: 2000,
            CircuitBoard: 1600
        }
    },
    ColonistPod: {
        Name: "Colonist Pod",
        Produced: 1,
        Required: {
            ElectronicCircuitBoard: 30,
            GoldFoil: 2
        }
    },

    //Rocket
    Upper: {
        Name: "Upper",
        Produced: 1,
        Required: {
            Cockpit: 16,
            ColonistPod: 2
        }
    },
    Lower: {
        Name: "Lower",
        Produced: 1,
        Required: {
            RocketHydrogenTank: 500,
            F1RocketEngine: 4
        }
    },
    Rocket: {
        Name: "Rocket",
        Produced: 1,
        Required: {
            Upper: 1,
            Lower: 4
        }
    }

};
