import hashlib
import hmac


def generate_unlock_password(device_random_code, lock_count):
        """
        生成解锁密码。

        Args:
            device_random_code (str): 设备随机码。
            lock_count (int): 锁定次数。

        Returns:
            str: 6位数字密码。
        """
        # 秘密密钥，请确保在实际应用中保护好这个密钥
        secret_key = 'the_secret_key_of_fute_company'

        # 组合输入
        message = f"{device_random_code}:{lock_count}"

        # 生成 HMAC-SHA256 哈希
        hash_bytes = hmac.new(
            key=secret_key.encode('utf-8'),
            msg=message.encode('utf-8'),
            digestmod=hashlib.sha256
        ).hexdigest()

        # 将哈希的前16个字符转换为整数
        hash_int = int(hash_bytes[:16], 16)

        # 映射到6位数字
        password = str(hash_int % 1000000).zfill(6)

        print('Expected password:', password)

        return password

generate_unlock_password('001O8K5ZWT', 4)