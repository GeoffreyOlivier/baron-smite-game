// Cached DOM references. Module scripts are deferred, so the DOM is parsed
// by the time this runs.

const $ = (id) => document.getElementById(id);

export const els = {
  particles:  $('particles'),
  flash:      $('flash'),

  startScreen:$('startscreen'),
  startBtn:   $('startbtn'),
  pseudo:     $('pseudo'),

  leaderboard:$('leaderboard'),
  lbList:     $('lbList'),

  baronImg:   $('baronImg'),
  baronSvg:   $('baronSvg'),
  smiteFx:    $('smiteFx'),
  team:       $('team'),

  hpfill:     $('hpfill'),
  hpnum:      $('hpnum'),
  phase:      $('phase'),

  smiteBtn:   $('smite'),
  smiteIcon:  $('smiteIcon'),
  smiteEmoji: $('smiteEmoji'),
  smiteDmg:   $('smiteDmg'),

  result:     $('result'),
  grade:      $('grade'),
  desc:       $('desc'),
  again:      $('again'),

  best:       $('best'),
  streak:     $('streak'),
};
