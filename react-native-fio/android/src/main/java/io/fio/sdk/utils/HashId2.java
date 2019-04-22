package io.fio.sdk.utils;

import java.math.BigInteger;
import java.util.ArrayList;


public class HashId2 {
    private static final BigInteger x1f = BigInteger.valueOf(0x1f);
    private static final BigInteger x0f = BigInteger.valueOf(0x0f);

    private static char[] lower = "abcdefghijkmnopqrstuvwxyz".toCharArray();
    private static char[] upper = "ABCDEFGHJKLMNPQRSTUVWXYZ".toCharArray();
    private static char[] number = "0123456789".toCharArray();
    private static char[] charmap = ".12345abcdefghijklmnopqrstuvwxyz".toCharArray();

    private ArrayList<Character> lowerAr = new ArrayList<Character>(lower.length);
    private ArrayList<Character> upperAr = new ArrayList<Character>(upper.length);
    private ArrayList<Character> numberAr = new ArrayList<Character>(number.length);


    private String mKey;

    public HashId2(String key) {
        this.mKey = key.substring(3);
        for (int i = 0; i < lower.length; i++) {
            lowerAr.add(lower[i]);
        }
        for (int i = 0; i < upper.length; i++) {
            upperAr.add(upper[i]);
        }
        for (int i = 0; i < number.length; i++) {
            numberAr.add(number[i]);
        }
    }


    public String getString() throws Exception {
        byte[] decoded = Base58.decode(mKey);
        BigInteger hash = shorten_key(decoded);
        return getString(hash);
    }


    private BigInteger shorten_key(byte[] key) throws Exception {
        BigInteger res = BigInteger.ZERO;
        BigInteger temp = BigInteger.ZERO;
        int toShift = 0;
        int i = 1;
        int len = 0;

        while (len <= 12) {
            if (i >= 33) {
                throw new Exception("Means the key has > 20 bytes with trailing zeroes...");
            }
            temp = BigInteger.valueOf(key[i] & (len == 12 ? 0x0f : 0x1f));
            if (temp == BigInteger.ZERO) {
                i++;
                continue;
            }
            toShift = len == 12 ? 0 : (5 * (12 - len) - 1);
            res = res.or(temp.shiftLeft(toShift));
            len++;
            i++;
        }

        return res;
    }

    private String getString(BigInteger hash) {
        BigInteger temp = hash;

        char[] str = new char[13];
        str[12] = charmap[temp.and(x0f).intValue()];

        temp = temp.shiftRight(4);
        for (int i = 1; i <= 12; i++) {
            char c = charmap[temp.and(x1f).intValue()];
            str[12 - i] = c;
            temp = temp.shiftRight(5);
        }
        String result = new String(str);
        if (result.length() > 12) {
            result = result.substring(0, 12);
        }
        return result;
    }


    /*public BigInteger step4() throws Exception {
        byte[] decoded = Base58.decode("6cDpi7vPnvRwMEdXtLnAmFwygaQ8CzD7vqKLBJ2GfgtHBQ4PPy");
        BigInteger result = shorten_key(decoded);
        System.out.println("step4: " + result.toString());
        return result;
    }

    public String step5(BigInteger hash){
            String result = getString(hash);
            System.out.println(result);
            return result;
    }*/


    /*public BigInteger pack() {
        String encoded = Base58.encode(mKey.substring(3).getBytes());

        int strLen = encoded.length();

        BigInteger value = BigInteger.ZERO;

        for (int i = 0; i <= 12; i++) {
            BigInteger c = BigInteger.ZERO;

            if (i < strLen) {
                c = BigInteger.valueOf(getCharValue(encoded.charAt(i)));
            }

            if (i < 12) {
                c = c.and(BigInteger.valueOf(0x1f));
                int toShift = 64 - 5 * (i + 1);

                c = c.shiftLeft(toShift);
            } else {
                c = c.and(BigInteger.valueOf(0x0f));
            }

            value = value.or(c);
        }

        this.value = value;
        return value;
    }*/




    /*private int getCharValue(char c) {
        if (lowerAr.contains(c)) {
            return Character.getNumericValue(c) + 87;
        }
        if (upperAr.contains(c)) {
            return Character.getNumericValue(c) + 55;
        }
        if (numberAr.contains(c)) {
            return Character.getNumericValue(c) + 48;
        }
        return 0;
    }*/
}
