const { SFTP } = require('ssh2/lib/protocol/SFTP');

// Exercise the real encoder on modern Node where util.isDate was removed.
test.each([undefined, new Date('2026-01-01T00:00:00Z'), 1767225600])(
  'encodes OPEN attributes with timestamp %s', timestamp => {
    const packets = [];
    const sftp = new SFTP({ _protocol: {
      _remoteIdentRaw: 'SSH-2.0-OpenSSH',
      channelData: (_, packet) => packets.push(Buffer.from(packet)),
    } }, { outgoing: { id: 0, state: 'open', window: 100000, packetSize: 32768 } });
    const attrs = timestamp === undefined ? {} : { atime: timestamp, mtime: timestamp };
    expect(() => sftp.open('/test.txt', 'r', attrs, () => {})).not.toThrow();
    expect(packets).toHaveLength(1);
    const packet = packets[0];
    expect(packet[4]).toBe(3); // SSH_FXP_OPEN
    const flagsOffset = 9 + 4 + Buffer.byteLength('/test.txt') + 4;
    expect(packet.readUInt32BE(flagsOffset)).toBe(timestamp === undefined ? 0 : 8);
    if (timestamp !== undefined) {
      expect(packet.readUInt32BE(flagsOffset + 4)).toBe(1767225600);
      expect(packet.readUInt32BE(flagsOffset + 8)).toBe(1767225600);
    }
  }
);
