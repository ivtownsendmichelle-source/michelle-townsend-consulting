export const GUIDANCE = {
  resentments: {
    original:
      'In dealing with resentments, we set them on paper. We listed people, institutions, or principles with whom we were angry. We asked ourselves why we were angry. In most cases it was found that our self-esteem, our pocketbooks, our ambitions, our personal relationships (including sex) were hurt or threatened. We were usually as much at fault as anyone else. We turned back to the list, for it held the key to the future. We were prepared to look at it from an entirely different angle. We began to see that the world and its people really dominated us. In that state, the wrong-doing of others, fancied or real, had power to actually kill. We asked God to help us show them the same tolerance, pity, and patience that we would cheerfully grant a sick friend.',
    modern:
      'Resentments are heavy. They take up room. This section is about getting them out of your head and onto paper so you can see them clearly.\n\nList the people, places, groups, or ideas you carry anger toward. Then ask: what part of you feels threatened? Your sense of self, your security, your relationships, your pride, your wallet, your plans.\n\nThis is not about who was right. It\'s about what you\'re carrying and why it still has a hold on you.\n\nWhen you\'re ready, look at your own part. Not to excuse anyone else, but to find where you have leverage to let go. Ask {{HP}} — or just ask yourself honestly — to help you see these people the way you\'d see someone who was sick. Not to forgive on command. Just to loosen the grip.',
  },
  fears: {
    original:
      'We reviewed our fears thoroughly. We put them on paper, even though we had no resentment in connection with them. We asked ourselves why we had them. Wasn\'t it because self-reliance had failed us? Self-reliance was good as far as it went, but it didn\'t go far enough. We asked God to remove our fear and direct our attention to what He would have us be.',
    modern:
      'Fear is not weakness. It\'s information.\n\nWrite down what you\'re afraid of. All of it. The rational and the irrational. The ones you talk about and the ones you don\'t.\n\nThen ask: where did this fear come from? Often fear is rooted in the belief that you have to handle everything alone, and the quiet panic that you can\'t.\n\nSelf-reliance isn\'t the problem. White-knuckling it is. The question here is: what if you didn\'t have to carry this alone?\n\nAsk {{HP}} — or just the honest part of yourself — to help you redirect your energy from the fear to what you could become without it.',
  },
  sex: {
    original:
      'We reviewed our own conduct over the years past. Where had we been selfish, dishonest, or inconsiderate? Whom had we hurt? Did we unjustifiably arouse jealousy, suspicion, or bitterness? Where were we at fault, what should we have done instead? We subjected each relation to this test — was it selfish or not?',
    modern:
      'This section is about your sexual and romantic conduct. Not about shame. Not about who you\'ve loved or how you\'ve loved. It\'s about where your behavior caused harm.\n\nThink about the people you\'ve been involved with. Were you honest? Were you considerate of their feelings? Did you create situations — jealousy, suspicion, manipulation — that hurt someone?\n\nThis applies equally regardless of your orientation, gender, or relationship structure. Harm is harm, whether in a marriage, a hookup, a throuple, or a situationship.\n\nThe goal is to see your patterns clearly. Not to catalog guilt. Ask: what did I actually do, and what should I have done instead? That\'s the whole question.',
  },
  harms: {
    original:
      'We made a list of all persons we had harmed, and became willing to make amends to them all. We considered carefully those we had hurt, the harm done, and the amends to be made.',
    modern:
      'This is the harms list. It will become your amends list later, but right now it\'s just about honesty.\n\nWho did you hurt? What did you do? How did it affect them? And what do you owe — not as punishment, but as repair?\n\nSome amends are direct: a conversation, a repayment, a changed behavior. Some are indirect: living differently, donating time, making it right through someone else. Some people on this list you may never contact, and that\'s okay. The willingness is what matters first.\n\nDon\'t edit the list to protect your ego. If a name comes up, write it down. You\'ll figure out the how later.',
  },
};

export function insertHP(text, term) {
  const replacement = term != null ? term : 'something larger than yourself';
  return text.replace(/\{\{HP\}\}/g, replacement);
}
