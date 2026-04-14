const fs = require('fs');
const path = require('path');

const uiDir = __dirname;
const sourcePath = path.join(uiDir, 'FivaliaJobs.pen.bak');
const targetPath = path.join(uiDir, 'FivaliaJobs.pen');

const COMPONENT_IDS = ['DlHH1', 'uZXe2', '36cBO', 's5rl2', 'jHofj', 'HrYhC', 'EKyuZ'];
const SCREEN_IDS = [
  '7RC1H',
  'rmYje',
  'HUBAJ',
  'tRUO4',
  'N0tjq',
  'NId6O',
  'PX8N0',
  '27WZp',
  'Y1Ze2',
  '9AxzP',
  '5CEgG',
  'tPeAm',
  'A9VyX',
  'uZqKf',
  'loGon',
  'lh73S',
  'cuZUf',
  'Eaory',
  'Fu9lA',
];

const PLATFORM_CONFIG = {
  cupertino: {
    name: 'Cupertino',
    headingX: 1800,
    headingY: 24,
    screensDx: 1800,
    screensDy: 120,
    componentsX: 3500,
    componentsY: 0,
    colors: {
      white: '#FFFFFF',
      surface: '#F2F2F7',
      surfaceAlt: '#E9EAF0',
      background: '#F2F2F7',
      grouped: '#FFFFFF',
      border: '#D1D1D6',
      borderSoft: '#E5E5EA',
      accent: '#007AFF',
      accentTint: '#EAF2FF',
      textPrimary: '#111111',
      textSecondary: '#6E6E73',
      textMuted: '#8E8E93',
      placeholder: '#E5E5EA',
      navFill: '#F7F7F9',
    },
    fonts: {
      body: 'SF Pro Text',
      heading: 'SF Pro Display',
    },
  },
  material: {
    name: 'Material',
    headingX: 0,
    headingY: 5448,
    screensDx: 0,
    screensDy: 5544,
    componentsX: -500,
    componentsY: 5424,
    colors: {
      white: '#FFFFFF',
      surface: '#F7F9FC',
      surfaceAlt: '#EEF3FD',
      background: '#F7F9FC',
      grouped: '#FFFFFF',
      border: '#D2DCE8',
      borderSoft: '#E3EAF5',
      accent: '#0B57D0',
      accentTint: '#E8F0FE',
      textPrimary: '#1F1F1F',
      textSecondary: '#5F6368',
      textMuted: '#80868B',
      placeholder: '#E3EAF5',
      navFill: '#FFFFFF',
    },
    fonts: {
      body: 'Roboto',
      heading: 'Roboto Flex',
    },
  },
};

const ICON_MAP_CUPERTINO = {
  home: 'house',
  add_circle: 'plus-circle',
  favorite: 'heart',
  person: 'user',
  search: 'search',
  arrow_back: 'chevron-left',
  work: 'briefcase',
  location_on: 'map-pin',
  notifications: 'bell',
  edit_square: 'square-pen',
  mail: 'mail',
  message: 'message-circle',
  forum: 'messages-square',
  send: 'send',
  close: 'x',
  check: 'check',
  tune: 'sliders-horizontal',
  bookmark: 'bookmark',
  calendar_today: 'calendar',
  favorite_border: 'heart',
  account_circle: 'circle-user-round',
  add: 'plus',
  work_outline: 'briefcase',
  public: 'globe',
  chat: 'message-circle',
};

const ICON_MAP_MATERIAL = {
  house: 'home',
  plus: 'add',
  'plus-circle': 'add_circle',
  heart: 'favorite',
  user: 'person',
  'chevron-left': 'arrow_back',
  briefcase: 'work',
  'map-pin': 'location_on',
  bell: 'notifications',
  'square-pen': 'edit_square',
  'message-circle': 'chat',
  'messages-square': 'forum',
  sliders: 'tune',
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function collectIds(node, ids = new Set()) {
  if (!node || typeof node !== 'object') return ids;
  if (typeof node.id === 'string') ids.add(node.id);
  if (Array.isArray(node.children)) node.children.forEach((child) => collectIds(child, ids));
  return ids;
}

function makeIdFactory(doc) {
  const used = collectIds(doc);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  return function newId() {
    let id = '';
    do {
      id = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    } while (used.has(id));
    used.add(id);
    return id;
  };
}

function cloneWithIdMap(node, newId) {
  const idMap = new Map();
  const copy = deepClone(node);

  function walk(current) {
    if (!current || typeof current !== 'object') return;
    if (typeof current.id === 'string') {
      const nextId = newId();
      idMap.set(current.id, nextId);
      current.id = nextId;
    }
    if (Array.isArray(current.children)) current.children.forEach(walk);
  }

  walk(copy);
  return { copy, idMap };
}

function replaceColor(value, colors) {
  if (typeof value !== 'string') return value;
  const map = {
    '$white': colors.white,
    '$surface': colors.surface,
    '$bg': colors.background,
    '$accent': colors.accent,
    '$accent-light': colors.accentTint,
    '$border': colors.border,
    '$text-primary': colors.textPrimary,
    '$text-secondary': colors.textSecondary,
    '$text-muted': colors.textMuted,
    '$placeholder-bg': colors.placeholder,
    '#FFFFFF': colors.white,
    '#F5F5F5': colors.surface,
    '#F0F0F0': colors.surfaceAlt,
    '#E0E0E0': colors.border,
    '#9E9E9E': colors.textMuted,
    '#6B6B6B': colors.textSecondary,
    '#1A1A1A': colors.textPrimary,
    '#333333': colors.accent,
    '#E8E8E8': colors.placeholder,
  };
  return map[value] || value;
}

function mapIcon(platform, name) {
  if (!name) return name;
  if (platform === 'cupertino') return ICON_MAP_CUPERTINO[name] || name;
  return ICON_MAP_MATERIAL[name] || name;
}

function findNodeByName(node, name) {
  if (!node || typeof node !== 'object') return null;
  if (node.name === name) return node;
  if (!Array.isArray(node.children)) return null;
  for (const child of node.children) {
    const found = findNodeByName(child, name);
    if (found) return found;
  }
  return null;
}

function walk(node, callback, parent = null) {
  if (!node || typeof node !== 'object') return;
  callback(node, parent);
  if (Array.isArray(node.children)) node.children.forEach((child) => walk(child, callback, node));
}

function applyTypography(node, platform) {
  const fonts = PLATFORM_CONFIG[platform].fonts;
  if (typeof node.fontFamily !== 'string') return;
  if (node.fontFamily === 'Inter' || node.fontFamily === '$font-body') node.fontFamily = fonts.body;
  if (node.fontFamily === 'Space Grotesk' || node.fontFamily === '$font-heading') node.fontFamily = fonts.heading;
}

function applyColorSystem(node, platform) {
  const colors = PLATFORM_CONFIG[platform].colors;
  if (typeof node.fill === 'string') node.fill = replaceColor(node.fill, colors);
  if (node.stroke && typeof node.stroke === 'object' && typeof node.stroke.fill === 'string') {
    node.stroke.fill = replaceColor(node.stroke.fill, colors);
  }
  if (node.type === 'icon_font' && typeof node.fill === 'string') node.fill = replaceColor(node.fill, colors);
}

function roundRect(node, radius) {
  if (typeof node.cornerRadius === 'number') node.cornerRadius = radius;
}

function setHeaderAsLargeTitle(node, titleId, actionId, platform) {
  const colors = PLATFORM_CONFIG[platform].colors;
  const fonts = PLATFORM_CONFIG[platform].fonts;
  const title = node.children.find((child) => child.id === titleId);
  const action = node.children.find((child) => child.id === actionId);

  node.layout = 'vertical';
  node.height = platform === 'cupertino' ? 96 : 92;
  node.gap = platform === 'cupertino' ? 8 : 10;
  node.padding = [14, 16, 14, 16];
  node.alignItems = undefined;
  node.justifyContent = undefined;
  node.fill = platform === 'cupertino' ? '#FBFBFD' : '#FFFFFF';
  node.stroke = {
    align: 'inside',
    thickness: { bottom: 1 },
    fill: colors.border,
  };

  const topRow = {
    type: 'frame',
    id: `${node.id}_top`,
    name: 'TopRow',
    width: 'fill_container',
    justifyContent: 'end',
    alignItems: 'center',
    children: action ? [action] : [],
  };

  if (action) {
    action.width = platform === 'cupertino' ? 30 : 24;
    action.height = platform === 'cupertino' ? 30 : 24;
    action.fill = platform === 'cupertino' ? colors.textSecondary : colors.textSecondary;
  }

  if (title) {
    title.fontFamily = fonts.heading;
    title.fontSize = platform === 'cupertino' ? 30 : 28;
    title.fontWeight = '700';
    title.fill = colors.textPrimary;
  }

  node.children = [topRow];
  if (title) node.children.push(title);
}

function setHeaderAsStandard(node, titleId, backId, platform) {
  const colors = PLATFORM_CONFIG[platform].colors;
  const fonts = PLATFORM_CONFIG[platform].fonts;
  const title = node.children.find((child) => child.id === titleId);
  const back = node.children.find((child) => child.id === backId);

  node.layout = 'horizontal';
  node.height = platform === 'cupertino' ? 56 : 64;
  node.gap = 12;
  node.padding = [0, 16];
  node.alignItems = 'center';
  node.justifyContent = undefined;
  node.fill = '#FFFFFF';
  node.stroke = {
    align: 'inside',
    thickness: { bottom: 1 },
    fill: colors.border,
  };

  if (back) {
    back.iconFontFamily = platform === 'cupertino' ? 'lucide' : 'Material Symbols Rounded';
    back.iconFontName = mapIcon(platform, back.iconFontName);
    back.fill = platform === 'cupertino' ? colors.accent : colors.textPrimary;
    back.width = 22;
    back.height = 22;
  }

  if (title) {
    title.fontFamily = platform === 'cupertino' ? fonts.body : fonts.heading;
    title.fontSize = platform === 'cupertino' ? 17 : 20;
    title.fontWeight = platform === 'cupertino' ? '600' : '700';
    title.fill = colors.textPrimary;
  }
}

function styleCupertinoComponent(component) {
  const colors = PLATFORM_CONFIG.cupertino.colors;
  const fonts = PLATFORM_CONFIG.cupertino.fonts;

  switch (component.name) {
    case 'Cupertino/Component/Input': {
      component.gap = 8;
      component.fill = colors.background;
      const label = findNodeByName(component, 'Label');
      const field = findNodeByName(component, 'Field');
      const placeholder = findNodeByName(component, 'Placeholder');
      if (label) {
        label.fill = colors.textSecondary;
        label.fontFamily = fonts.body;
        label.fontSize = 13;
        label.fontWeight = '600';
      }
      if (field) {
        field.height = 50;
        field.fill = colors.grouped;
        field.cornerRadius = 14;
        field.stroke = {
          align: 'inside',
          thickness: 1,
          fill: colors.borderSoft,
        };
        field.padding = [0, 16];
      }
      if (placeholder) {
        placeholder.fill = colors.textMuted;
        placeholder.fontSize = 16;
      }
      break;
    }
    case 'Cupertino/Component/ButtonPrimary': {
      component.height = 50;
      component.fill = colors.accent;
      component.cornerRadius = 16;
      const label = findNodeByName(component, 'Label');
      if (label) {
        label.fontFamily = fonts.body;
        label.fontSize = 17;
        label.fontWeight = '600';
      }
      break;
    }
    case 'Cupertino/Component/ButtonSecondary': {
      component.height = 50;
      component.fill = colors.accentTint;
      component.cornerRadius = 16;
      component.stroke = undefined;
      const label = findNodeByName(component, 'Label');
      if (label) {
        label.fill = colors.accent;
        label.fontFamily = fonts.body;
        label.fontSize = 17;
        label.fontWeight = '600';
      }
      break;
    }
    case 'Cupertino/Component/BottomNav': {
      component.height = 78;
      component.fill = colors.navFill;
      component.stroke = {
        align: 'inside',
        thickness: { top: 1 },
        fill: colors.border,
      };
      component.padding = [8, 10, 12, 10];
      const active = findNodeByName(component, 'NavFeed');
      if (active) {
        active.fill = colors.accentTint;
        active.cornerRadius = 18;
        active.width = 82;
        active.padding = [8, 12];
        active.gap = 4;
        const [icon, text] = active.children;
        if (icon) icon.fill = colors.accent;
        if (text) {
          text.fill = colors.accent;
          text.fontWeight = '600';
        }
      }
      ['NavCreate', 'NavInterests', 'NavProfile'].forEach((name) => {
        const item = findNodeByName(component, name);
        if (item) {
          item.width = 72;
          item.gap = 4;
        }
      });
      break;
    }
    case 'Cupertino/Component/PostCard': {
      component.fill = colors.grouped;
      component.cornerRadius = 24;
      component.stroke = {
        align: 'inside',
        thickness: 1,
        fill: colors.borderSoft,
      };
      component.gap = 14;
      component.padding = 18;
      const title = findNodeByName(component, 'Title');
      const description = findNodeByName(component, 'Description');
      const action = findNodeByName(component, 'MeInteresaBtn');
      if (title) {
        title.fontFamily = fonts.heading;
        title.fontSize = 17;
      }
      if (description) {
        description.fontSize = 14;
        description.lineHeight = 1.35;
      }
      if (action) {
        action.fill = colors.accentTint;
        action.cornerRadius = 18;
        action.height = 36;
        const [icon, text] = action.children;
        if (icon) icon.fill = colors.accent;
        if (text) {
          text.fill = colors.accent;
          text.fontFamily = fonts.body;
          text.fontWeight = '600';
        }
      }
      break;
    }
    case 'Cupertino/Component/TabBar': {
      component.height = 36;
      component.fill = colors.surfaceAlt;
      component.cornerRadius = 12;
      component.padding = 2;
      const active = findNodeByName(component, 'TabActive');
      const inactive = findNodeByName(component, 'TabInactive');
      if (active) {
        active.fill = colors.white;
        active.cornerRadius = 10;
      }
      if (inactive) inactive.cornerRadius = 10;
      break;
    }
    case 'Cupertino/Component/InterestItem': {
      component.fill = colors.grouped;
      roundRect(component, 22);
      if (component.stroke) component.stroke.fill = colors.borderSoft;
      break;
    }
  }
}

function styleMaterialComponent(component) {
  const colors = PLATFORM_CONFIG.material.colors;
  const fonts = PLATFORM_CONFIG.material.fonts;

  switch (component.name) {
    case 'Material/Component/Input': {
      component.gap = 6;
      const label = findNodeByName(component, 'Label');
      const field = findNodeByName(component, 'Field');
      const placeholder = findNodeByName(component, 'Placeholder');
      if (label) {
        label.fill = colors.accent;
        label.fontFamily = fonts.body;
        label.fontSize = 12;
        label.fontWeight = '600';
      }
      if (field) {
        field.height = 56;
        field.fill = colors.surfaceAlt;
        field.cornerRadius = 16;
        field.stroke = undefined;
        field.padding = [0, 16];
      }
      if (placeholder) {
        placeholder.fill = colors.textSecondary;
        placeholder.fontSize = 16;
      }
      break;
    }
    case 'Material/Component/ButtonPrimary': {
      component.height = 48;
      component.fill = colors.accent;
      component.cornerRadius = 24;
      const label = findNodeByName(component, 'Label');
      if (label) {
        label.fontFamily = fonts.body;
        label.fontSize = 14;
        label.fontWeight = '600';
      }
      break;
    }
    case 'Material/Component/ButtonSecondary': {
      component.height = 48;
      component.fill = colors.white;
      component.cornerRadius = 24;
      component.stroke = {
        align: 'inside',
        thickness: 1,
        fill: colors.border,
      };
      const label = findNodeByName(component, 'Label');
      if (label) {
        label.fill = colors.accent;
        label.fontFamily = fonts.body;
        label.fontSize = 14;
        label.fontWeight = '600';
      }
      break;
    }
    case 'Material/Component/BottomNav': {
      component.height = 80;
      component.fill = colors.white;
      component.stroke = {
        align: 'inside',
        thickness: { top: 1 },
        fill: colors.border,
      };
      component.padding = [10, 10, 14, 10];
      const active = findNodeByName(component, 'NavFeed');
      if (active) {
        active.fill = colors.accentTint;
        active.cornerRadius = 18;
        active.width = 86;
        active.padding = [8, 14];
        active.gap = 4;
        const [icon, text] = active.children;
        if (icon) icon.fill = colors.accent;
        if (text) {
          text.fill = colors.accent;
          text.fontWeight = '600';
        }
      }
      ['NavCreate', 'NavInterests', 'NavProfile'].forEach((name) => {
        const item = findNodeByName(component, name);
        if (item) {
          item.width = 72;
          item.gap = 4;
        }
      });
      break;
    }
    case 'Material/Component/PostCard': {
      component.fill = colors.white;
      component.cornerRadius = 24;
      component.stroke = {
        align: 'inside',
        thickness: 1,
        fill: colors.border,
      };
      component.gap = 14;
      component.padding = 18;
      const title = findNodeByName(component, 'Title');
      const description = findNodeByName(component, 'Description');
      const action = findNodeByName(component, 'MeInteresaBtn');
      if (title) {
        title.fontFamily = fonts.heading;
        title.fontSize = 18;
        title.fontWeight = '700';
      }
      if (description) {
        description.fontSize = 14;
        description.lineHeight = 1.4;
      }
      if (action) {
        action.fill = colors.accent;
        action.cornerRadius = 20;
        action.height = 40;
        const [icon, text] = action.children;
        if (icon) icon.fill = colors.white;
        if (text) {
          text.fill = colors.white;
          text.fontFamily = fonts.body;
          text.fontSize = 14;
          text.fontWeight = '600';
        }
      }
      break;
    }
    case 'Material/Component/TabBar': {
      component.height = 44;
      component.fill = colors.white;
      component.stroke = {
        align: 'inside',
        thickness: 1,
        fill: colors.border,
      };
      component.cornerRadius = 22;
      component.padding = 4;
      const active = findNodeByName(component, 'TabActive');
      const inactive = findNodeByName(component, 'TabInactive');
      if (active) {
        active.fill = colors.accentTint;
        active.cornerRadius = 18;
        const label = findNodeByName(active, 'tabActiveLabel');
        if (label) label.fill = colors.accent;
      }
      if (inactive) inactive.cornerRadius = 18;
      break;
    }
    case 'Material/Component/InterestItem': {
      component.fill = colors.white;
      roundRect(component, 20);
      if (component.stroke) component.stroke.fill = colors.border;
      break;
    }
  }
}

function styleSearchBar(node, platform) {
  const colors = PLATFORM_CONFIG[platform].colors;
  if (!node || node.name !== 'SearchBar') return;
  node.height = platform === 'cupertino' ? 38 : 44;
  node.fill = platform === 'cupertino' ? colors.surfaceAlt : colors.surfaceAlt;
  node.cornerRadius = platform === 'cupertino' ? 12 : 22;
  node.stroke = undefined;
}

function styleBadgesAndChips(node, platform) {
  const colors = PLATFORM_CONFIG[platform].colors;
  if (/Badge|Chip/.test(node.name || '')) {
    roundRect(node, platform === 'cupertino' ? 16 : 18);
    if (node.fill === colors.accent || node.fill === colors.accentTint) return;
    if (typeof node.fill === 'string') {
      node.fill = platform === 'cupertino' ? colors.surfaceAlt : colors.accentTint;
    }
  }
}

function styleListCard(node, platform) {
  const colors = PLATFORM_CONFIG[platform].colors;
  if (!/Item|Card|Preview|Wrap/.test(node.name || '')) return;
  if (node.type !== 'frame') return;
  if (typeof node.fill !== 'string') return;
  if (node.fill === colors.white || node.fill === colors.surface || node.fill === colors.surfaceAlt) {
    if (/NotifItem|MessageItem|AppCard|PostPreview/.test(node.name || '')) {
      node.fill = colors.grouped;
      roundRect(node, platform === 'cupertino' ? 20 : 24);
      node.stroke = {
        align: 'inside',
        thickness: 1,
        fill: platform === 'cupertino' ? colors.borderSoft : colors.border,
      };
      node.padding = node.padding || 16;
    }
  }
}

function styleScreen(screen, platform) {
  const colors = PLATFORM_CONFIG[platform].colors;
  const fonts = PLATFORM_CONFIG[platform].fonts;

  screen.fill = /Profile|Apply to Post/.test(screen.name) ? colors.white : colors.background;

  walk(screen, (node, parent) => {
    applyColorSystem(node, platform);
    applyTypography(node, platform);

    if (node.type === 'icon_font') {
      node.iconFontFamily = platform === 'cupertino' ? 'lucide' : 'Material Symbols Rounded';
      node.iconFontName = mapIcon(platform, node.iconFontName);
    }

    if (node.type === 'text' && typeof node.fill === 'string' && parent?.name === 'Header') {
      node.fill = colors.textPrimary;
    }

    styleSearchBar(node, platform);
    styleBadgesAndChips(node, platform);
    styleListCard(node, platform);
  });

  const header = screen.children.find((child) => child.name === 'Header');
  if (header) {
    const titleNode = header.children.find((child) => child.type === 'text');
    const actionNode = header.children.find((child) => child.type === 'icon_font' || child.name === 'Badge' || child.name === 'markAll');
    const backNode = header.children.find((child) => child.type === 'icon_font' && /back/i.test(child.name || ''));

    const mainScreens = [
      'Home Feed',
      'Interests',
      'Feed Empty State',
      'Search',
      'Notifications',
      'Messages',
      'My Applications',
      'User Posts',
    ];
    const isMain = mainScreens.some((part) => screen.name.includes(part));

    if (isMain && titleNode && actionNode && screen.name !== `${PLATFORM_CONFIG[platform].name}/13 - Search`) {
      setHeaderAsLargeTitle(header, titleNode.id, actionNode.id, platform);
    } else if (screen.name.includes('Search')) {
      header.fill = platform === 'cupertino' ? '#FBFBFD' : '#FFFFFF';
      if (titleNode) {
        titleNode.fontFamily = fonts.heading;
        titleNode.fontSize = platform === 'cupertino' ? 30 : 28;
        titleNode.fontWeight = '700';
      }
      if (header.padding) {
        header.padding = platform === 'cupertino' ? [14, 16, 12, 16] : [16, 16, 12, 16];
      }
    } else if (titleNode && backNode) {
      setHeaderAsStandard(header, titleNode.id, backNode.id, platform);
    } else if (titleNode) {
      header.height = platform === 'cupertino' ? 60 : 64;
      header.padding = [0, 16];
      header.fill = '#FFFFFF';
      header.stroke = {
        align: 'inside',
        thickness: { bottom: 1 },
        fill: colors.border,
      };
      titleNode.fontFamily = platform === 'cupertino' ? fonts.body : fonts.heading;
      titleNode.fontSize = platform === 'cupertino' ? 20 : 22;
      titleNode.fontWeight = '700';
    }
  }

  const body = screen.children.find((child) => child.name === 'Body' || child.name === 'Content');
  if (body) {
    body.gap = platform === 'cupertino' ? 14 : 16;
    if (body.padding === 16 || body.padding === 20) body.padding = platform === 'cupertino' ? 20 : 16;
  }

  if (screen.name.includes('Public Profile') || screen.name.includes('Profile')) {
    const profileInfo = findNodeByName(screen, 'ProfileInfo');
    if (profileInfo) profileInfo.gap = platform === 'cupertino' ? 12 : 14;
    const name = findNodeByName(screen, 'pubName');
    if (name) {
      name.fontFamily = fonts.heading;
      name.fontSize = platform === 'cupertino' ? 28 : 26;
      name.fontWeight = '700';
    }
    const bio = findNodeByName(screen, 'pubBio');
    if (bio) {
      bio.fontSize = 14;
      bio.lineHeight = 1.45;
    }
  }

  if (screen.name.includes('Apply to Post')) {
    const preview = findNodeByName(screen, 'PostPreview');
    if (preview) {
      preview.fill = colors.grouped;
      preview.cornerRadius = platform === 'cupertino' ? 22 : 24;
      preview.stroke = {
        align: 'inside',
        thickness: 1,
        fill: platform === 'cupertino' ? colors.borderSoft : colors.border,
      };
    }
  }
}

function cloneComponent(original, platform, newId) {
  const { copy, idMap } = cloneWithIdMap(original, newId);
  copy.name = `${PLATFORM_CONFIG[platform].name}/${original.name}`;
  copy.x = PLATFORM_CONFIG[platform].componentsX;
  copy.y = PLATFORM_CONFIG[platform].componentsY;

  walk(copy, (node) => {
    applyColorSystem(node, platform);
    applyTypography(node, platform);
    if (node.type === 'icon_font') {
      node.iconFontFamily = platform === 'cupertino' ? 'lucide' : 'Material Symbols Rounded';
      node.iconFontName = mapIcon(platform, node.iconFontName);
    }
  });

  if (platform === 'cupertino') styleCupertinoComponent(copy);
  if (platform === 'material') styleMaterialComponent(copy);

  return { component: copy, descendantMap: idMap };
}

function cloneScreen(original, platform, newId, componentInfo) {
  const { copy, idMap } = cloneWithIdMap(original, newId);
  copy.name = `${PLATFORM_CONFIG[platform].name}/${original.name}`;
  if (typeof copy.x === 'number') copy.x += PLATFORM_CONFIG[platform].screensDx;
  if (typeof copy.y === 'number') copy.y += PLATFORM_CONFIG[platform].screensDy;

  walk(copy, (node) => {
    const originalRef = node.ref;
    if (originalRef && componentInfo[platform][originalRef]) {
      const target = componentInfo[platform][originalRef];
      node.ref = target.component.id;
      if (node.descendants && typeof node.descendants === 'object') {
        const nextDescendants = {};
        for (const [key, value] of Object.entries(node.descendants)) {
          nextDescendants[target.descendantMap.get(key) || key] = value;
        }
        node.descendants = nextDescendants;
      }
    }

    applyColorSystem(node, platform);
    applyTypography(node, platform);
    if (node.type === 'icon_font') {
      node.iconFontFamily = platform === 'cupertino' ? 'lucide' : 'Material Symbols Rounded';
      node.iconFontName = mapIcon(platform, node.iconFontName);
    }
  });

  styleScreen(copy, platform);
  return { screen: copy, idMap };
}

function createPlatformHeadings(platform, newId) {
  const config = PLATFORM_CONFIG[platform];
  return [
    {
      type: 'text',
      id: newId(),
      name: `Platform/${config.name}`,
      x: config.headingX,
      y: config.headingY,
      content: `${config.name} Variants`,
      fill: config.colors.textPrimary,
      fontFamily: config.fonts.heading,
      fontSize: 34,
      fontWeight: '700',
    },
    {
      type: 'text',
      id: newId(),
      name: `Platform/${config.name}Note`,
      x: config.headingX,
      y: config.headingY + 44,
      content:
        platform === 'cupertino'
          ? 'Títulos grandes, navegación ligera, controles tintados y superficies tipo iOS.'
          : 'Jerarquía Material 3, acciones con acento azul, nav con indicador y campos llenos.',
      fill: config.colors.textSecondary,
      fontFamily: config.fonts.body,
      fontSize: 15,
      fontWeight: 'normal',
    },
  ];
}

function main() {
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const target = deepClone(source);
  const newId = makeIdFactory(target);

  const originals = Object.fromEntries(target.children.map((node) => [node.id, node]));
  const generated = [];
  const componentInfo = { cupertino: {}, material: {} };

  for (const platform of ['cupertino', 'material']) {
    let nextY = PLATFORM_CONFIG[platform].componentsY;
    for (const id of COMPONENT_IDS) {
      const original = originals[id];
      const { component, descendantMap } = cloneComponent(original, platform, newId);
      component.y = nextY;
      nextY += (typeof component.height === 'number' ? component.height : 80) + 28;
      componentInfo[platform][id] = { component, descendantMap };
      generated.push(component);
    }
    generated.push(...createPlatformHeadings(platform, newId));
  }

  for (const platform of ['cupertino', 'material']) {
    for (const id of SCREEN_IDS) {
      const original = originals[id];
      const { screen } = cloneScreen(original, platform, newId, componentInfo);
      generated.push(screen);
    }
  }

  target.children.push(...generated);
  fs.writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  console.log(`Wrote ${generated.length} generated nodes to ${targetPath}`);
}

main();
