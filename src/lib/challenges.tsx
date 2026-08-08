import React from 'react';
import { 
  Bike, TreeDeciduous, LightbulbOff, Trash2, Droplet, Recycle, 
  Coffee, Bus, Search, ShoppingBag, Leaf, Droplets, BatteryCharging, Factory, Zap, Star
} from 'lucide-react';

export const CHALLENGES_DATA = [
  // Sample / Demo
  { id: 'demo_sample', title: '🎯 Sample Eco Challenge', xp: 1000, envRewards: {}, icon: <Star className="w-8 h-8 text-yellow-400" />, desc: 'Complete this sample challenge to get EP and try the Eco Map.', reqRank: 0, question: 'Are you ready to restore the environment?' },
  // Original 6
  { id: 'bike', title: 'Ride a Bicycle', xp: 20, envRewards: { carbonSaved: 5 }, icon: <Bike className="w-8 h-8" />, desc: 'Use a bicycle for your daily commute instead of a car.', reqRank: 0, question: 'How many kilometers did you ride today?' },
  { id: 'tree', title: 'Plant a Tree', xp: 50, envRewards: { treesSaved: 1 }, icon: <TreeDeciduous className="w-8 h-8" />, desc: 'Plant a tree in your local community or garden.', reqRank: 0, question: 'What type of tree did you plant?' },
  { id: 'light', title: 'Turn Off Unused Lights', xp: 10, envRewards: { carbonSaved: 2 }, icon: <LightbulbOff className="w-8 h-8" />, desc: 'Turn off lights when leaving a room.', reqRank: 0, question: 'Which room did you save energy in today?' },
  { id: 'plastic', title: 'Avoid Single-Use Plastic', xp: 15, envRewards: { plasticReduced: 1 }, icon: <Trash2 className="w-8 h-8" />, desc: 'Avoid one single-use plastic item today.', reqRank: 0, question: 'What plastic item did you avoided using?' },
  { id: 'water', title: 'Take a Shorter Shower', xp: 10, envRewards: { waterSaved: 10 }, icon: <Droplet className="w-8 h-8" />, desc: 'Reduce your shower time today.', reqRank: 0, question: 'How many minutes did you save?' },
  { id: 'recycle', title: 'Separate Waste', xp: 15, envRewards: { plasticReduced: 2 }, icon: <Recycle className="w-8 h-8" />, desc: 'Separate recyclable and non-recyclable waste.', reqRank: 0, question: 'What items did you segregate today?' },
  // New 10
  { id: 'reusable_bottle', title: 'Use a Reusable Water Bottle', xp: 10, envRewards: { plasticReduced: 1 }, icon: <Coffee className="w-8 h-8" />, desc: 'Use a reusable bottle instead of a disposable plastic bottle.', reqRank: 0, question: 'What kind of bottle did you use?' },
  { id: 'public_transport', title: 'Use Public Transport', xp: 20, envRewards: { carbonSaved: 4 }, icon: <Bus className="w-8 h-8" />, desc: 'Use public transport instead of a private vehicle for one trip.', reqRank: 0, question: 'Which public transport did you take?' },
  { id: 'small_plant', title: 'Plant a Small Plant', xp: 25, envRewards: { treesSaved: 0.5 }, icon: <Leaf className="w-8 h-8" />, desc: 'Plant or care for a plant today.', reqRank: 0, question: 'What plant did you care for?' },
  { id: 'reuse_item', title: 'Reuse Before Throwing Away', xp: 15, envRewards: { carbonSaved: 1 }, icon: <Search className="w-8 h-8" />, desc: 'Reuse an item instead of throwing it away.', reqRank: 0, question: 'What item did you repurpose?' },
  { id: 'cloth_bag', title: 'Carry a Cloth Bag', xp: 10, envRewards: { plasticReduced: 1 }, icon: <ShoppingBag className="w-8 h-8" />, desc: 'Use a reusable cloth bag while shopping.', reqRank: 0, question: 'Where did you go shopping with your cloth bag?' },
  { id: 'save_water', title: 'Save Water', xp: 10, envRewards: { waterSaved: 5 }, icon: <Droplets className="w-8 h-8" />, desc: 'Avoid unnecessary water usage today.', reqRank: 0, question: 'How did you save water today?' },
  { id: 'unplug_electronics', title: 'Unplug Electronics', xp: 15, envRewards: { carbonSaved: 2 }, icon: <Zap className="w-8 h-8" />, desc: 'Unplug fully charged devices and electronics not in use.', reqRank: 0, question: 'What device did you unplug?' },
  { id: 'eat_plant_based', title: 'Eat a Plant-Based Meal', xp: 20, envRewards: { carbonSaved: 3 }, icon: <Leaf className="w-8 h-8" />, desc: 'Replace one meat-based meal with a plant-based alternative.', reqRank: 0, question: 'What plant-based meal did you enjoy?' },
  { id: 'rechargeable_batteries', title: 'Use Rechargeable Batteries', xp: 15, envRewards: { carbonSaved: 1 }, icon: <BatteryCharging className="w-8 h-8" />, desc: 'Use rechargeable batteries instead of disposable ones.', reqRank: 0, question: 'What device did you power?' },
  { id: 'second_hand', title: 'Buy Second-Hand', xp: 20, envRewards: { carbonSaved: 5 }, icon: <Factory className="w-8 h-8" />, desc: 'Purchase a second-hand item instead of something new.', reqRank: 0, question: 'What did you buy second-hand?' },
];
