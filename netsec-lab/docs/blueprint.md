# **App Name**: NetSec Duel

## Core Features:

- Network Visualization: Display a network graph with nodes in different states (Healthy, Infected, Hardened).
- Attack Actions: Implement attacker actions: deploy virus to infect specific node; deploy worm to spread from an infected node; exfiltrate data from an infected node if it remains infected after a cool-down period.
- Defense Actions: Implement defender actions: Scan to remove infection, shield against an attack.
- Action Cooldowns: Enforce cooldown periods for attack deployment and node shielding.
- Multi-Game Support: Enable multiple games running concurrently, each identified by a unique room code.
- Player Assignment: Allow players to join a game using a room code and automatically assign them to either the Attacker or Defender team using a load balancing tool.

## Style Guidelines:

- Primary color: Intense Blue (#1E90FF), a vibrant hue for a digital security theme.
- Background color: Light gray (#E0E0E0), providing a subtle backdrop that doesn't distract from the network display.
- Accent color: Electric Green (#7CFC00), a bold contrast to highlight critical elements or alerts.
- Secondary accent color: Deep Purple (#800080), adding depth and sophistication for less critical UI elements.
- Font: 'Inter', a grotesque-style sans-serif that conveys a modern, machined look, suitable for both headlines and body text.
- Use icons that are intuitive and directly represent network security concepts: shields for defense, viruses for attack, and nodes for network devices.
- Design the layout to focus on the network graph, using a clear hierarchy to separate interactive elements from the game's visual output.
- Use smooth transitions and feedback animations when nodes change state (e.g., from healthy to infected), reinforcing game actions.