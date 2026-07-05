namespace TCS34725 {

    const ADDR = 0x29

    const ENABLE = 0x00
    const ATIME = 0x01
    const CONTROL = 0x0F

    const PON = 0x01
    const AEN = 0x02

    const CDATA = 0x14

    let clear = 0
    let red = 0
    let green = 0
    let blue = 0

    function writeReg(reg: number, value: number): void {
        let buf = pins.createBuffer(2)
        buf[0] = 0x80 | reg
        buf[1] = value
        pins.i2cWriteBuffer(ADDR, buf)
    }

    //% block="Initialize TCS34725"
    //% weight=100
    export function begin(): void {

        writeReg(ENABLE, PON)
        basic.pause(5)

        writeReg(ENABLE, PON | AEN)

        writeReg(ATIME, 0xC0)

        writeReg(CONTROL, 0x02)

        basic.pause(200)
    }

    //% block="Update sensor"
    //% weight=99
    export function update(): void {

        pins.i2cWriteNumber(
            ADDR,
            0x80 | CDATA,
            NumberFormat.UInt8BE,
            false
        )

        let data = pins.i2cReadBuffer(ADDR, 8)

        clear = data[0] | (data[1] << 8)
        red = data[2] | (data[3] << 8)
        green = data[4] | (data[5] << 8)
        blue = data[6] | (data[7] << 8)

        if (clear > 0) {

            red = Math.round(red * 255 / clear)
            green = Math.round(green * 255 / clear)
            blue = Math.round(blue * 255 / clear)

            if (red > 255) red = 255
            if (green > 255) green = 255
            if (blue > 255) blue = 255

        } else {

            red = 0
            green = 0
            blue = 0

        }

    }

    //% block="Red"
    //% weight=90
    export function redValue(): number {
        return red
    }

    //% block="Green"
    //% weight=89
    export function greenValue(): number {
        return green
    }

    //% block="Blue"
    //% weight=88
    export function blueValue(): number {
        return blue
    }

    //% block="Clear"
    //% weight=87
    export function clearValue(): number {
        return clear
    }

}